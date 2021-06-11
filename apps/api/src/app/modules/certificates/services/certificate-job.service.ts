import {
    CERTIFICATE_JOB_SEPARATOR,
    ECertificateJobStatus,
    ECertificatesFileStatus,
    ICertificateJob
} from '@kitchen/api-interfaces';
import {CertEntity, CertificateJobEntity} from '@kitchen/domain';
import {HttpService, Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {InjectRepository} from '@nestjs/typeorm';
import {forkJoin, from, Observable, throwError} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Raw, Repository} from 'typeorm';
import {BaseCrudService} from '../../base-crud.service';
import {ConfigService} from '../../config';
import {LoggerService} from '../../logger';
import {CertificateService} from './certificate.service';

@Injectable()
export class CertificateJobService extends BaseCrudService<CertificateJobEntity> {
    constructor(
        @InjectRepository(CertificateJobEntity) private _repo: Repository<CertificateJobEntity>,
        private _certService: CertificateService,
        protected _logger: LoggerService,
        private _httpService: HttpService,
        private _config: ConfigService,
    ) {
        super(_repo, _logger);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    // @Cron(CronExpression.EVERY_30_SECONDS)
    public findJobs() {
        from(
            this._certService.ormRepo.find({
                where: {
                    alertDate: Raw(alias => `${alias} <= trunc(sysdate)`),
                    // certFile: {
                    //     status: ECertificatesFileStatus.ACTIVE,
                    // },
                },
                relations: ['certFile'],
            })
        )
            .pipe(
                map((certs: CertEntity[]) => certs.filter(i => i.certFile.status === ECertificatesFileStatus.ACTIVE)),
                tap((certs: CertEntity[]) => this._logger.info(`Find alerting certificates: ${certs.map(i => i.id).join(',')}`)),
                switchMap((certs: CertEntity[]) => {
                    return forkJoin(certs.map(cert => {
                            const job: ICertificateJob = cert.jobs.find(j => j.status === ECertificateJobStatus.PENDING);
                            return forkJoin(
                                job.emails.split(CERTIFICATE_JOB_SEPARATOR)
                                    .map((email: string) => this._alertEmail(cert, email))
                            )
                                .pipe(
                                    switchMap(() => {
                                        job.status = ECertificateJobStatus.DONE;
                                        job.updated = new Date().toISOString();

                                        const nextJob = {
                                            emails: job.emails,
                                            status: ECertificateJobStatus.PENDING,
                                        };
                                        cert.jobs.push(nextJob);
                                        return this._certService.updateOne(cert.id, cert)
                                            .then(() => this._logger.info(`Update jobs for cert: ${cert.id}`));
                                    }),
                                );
                        })
                    );
                }),
                catchError((e) => {
                    this._logger.error(e);
                    return throwError(e);
                })
            )
            .subscribe();
    }

    private _alertEmail(cert: CertEntity, email: string): Observable<any> {
        return this._httpService.post(
                this._config.SEND_NOTIFICATION,
                {
                    eventName: 'FREE_TEXT_EMAIL',
                    destination: {
                        email
                    },
                    managementParams: {
                        msgSubject: `[Kitchen] Certificate ${cert.subject} is going to expire`
                    },
                    contextParams: {
                        text: `
                        ${cert.subject} expires at ${new Date(cert.validTo).toLocaleString()}\n
                        ${this._config.KITCHEN_ENDPOINT}/certificates/${cert.certFile.id}
                        `
                    }
                }
            )
            .pipe(
                tap(() => {
                    this._logger.info(`${email} for certificate ${cert.subject} alert sent`);
                }),
            );
    }
}
