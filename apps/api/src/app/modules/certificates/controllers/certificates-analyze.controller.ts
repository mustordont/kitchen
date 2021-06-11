import {EModules, ICertificate} from '@kitchen/api-interfaces';
import {CertificateAnalyzeDto} from '@kitchen/domain';
import {Controller, Post, Res, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import * as AdmZip from 'adm-zip';
import {Express, Response} from 'express'
// This is a hack to make Multer available in the Express namespace
import {Multer} from 'multer';
import * as net from 'net';
import {extname} from 'path';
import * as tls from 'tls';
import {PeerCertificate} from 'tls';
import {ADGroupsGuard, RequiredADGroups} from '../../auth';
import {EREQUIRED_GROUPS} from '../../config';
import {LoggerService} from '../../logger';

type CertificatesType = PeerCertificate | object | null;

@ApiTags(EModules.CERTIFICATES)
@RequiredADGroups(EREQUIRED_GROUPS.CERTIFICATE)
@UseGuards(ADGroupsGuard)
@Controller('certificate/analyze')
export class CertificatesAnalyzeController {
    constructor(
        private readonly _logger: LoggerService,
    ) {
    }

    @ApiResponse({ status: 200, type: CertificateAnalyzeDto, isArray: true })
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async analyze(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        try {
            let certs = [];

            if (extname(file.originalname) === '.zip') {
                const zip = new AdmZip(file.buffer);
                // get all entries and iterate them
                zip.getEntries().forEach((entry) => {
                    const entryName: string = entry.entryName;
                    if (['.crt', '.cer'].includes(extname(entryName))) {
                        const fileText: string = zip.readAsText(entry);
                        certs = certs.concat(this._parseFileForCerts(fileText));
                    }
                });
            } else {
                certs = this._parseFileForCerts(file.buffer.toString());
            }

            const unique = [...certs.reduce((a: Map<string, PeerCertificate>, c: PeerCertificate) => {
                a.set(c.fingerprint256, c);
                return a;
            }, new Map()).values()];

            res.json(
                unique.map((i: PeerCertificate): ICertificate => {
                    const alertDate: Date = new Date(i.valid_to);
                    alertDate.setMonth(alertDate.getMonth() - 1);
                    return {
                        subject: JSON.stringify(i.subject),
                        validFrom: i.valid_from,
                        validTo: i.valid_to,
                        alertDate: alertDate.toISOString(),
                        jobs: [],
                    }
                })
            );
        } catch (error) {
            this._logger.error(error);
            res.status(500).json({error});
        }
    }

    private _parseFileForCerts(data: string): any {
        return data.match(/-----BEGIN CERTIFICATE-----(.*?)-----END CERTIFICATE-----/smg)
            .reduce((acc: CertificatesType[], current: string) => {
                return acc.concat(this._parseCert(current));
            }, []);
    }

    private _parseCert(data: string): CertificatesType {
        const secureContext = tls.createSecureContext({
            cert: data
        });
        const secureSocket = new tls.TLSSocket(new net.Socket(), { secureContext });
        return secureSocket.getCertificate();
    }
}
