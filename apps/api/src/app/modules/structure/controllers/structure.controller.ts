import {EModules, IAccount, IStructureBlock} from '@kitchen/api-interfaces';
import {Controller, Get, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {Client} from 'ldapts';
import {Entry} from 'ldapts/messages';
import {
    User,
    AD_ACCOUNT_SEARCH_ATTRIBUTES,
    isStringValue,
    IUserEntry,
    LDAPService,
    parseADUserData
} from '../../auth';
import {ConfigService} from '../../config';

import {LoggerService} from '../../logger';
import {StructureService} from '../services';

@ApiTags(EModules.KITCHEN)
@Controller('structure')
export class StructureController {
    private _client: Client;

    constructor(
        private _config: ConfigService,
        private _ldapService: LDAPService,
        private _logger: LoggerService,
        private readonly _service: StructureService,
    ) {
    }

    @ApiResponse(
        {
            status: 200, type: () => ({
                message: 'success'
                })
        }
    )
    @UseGuards(AuthGuard())
    @Get('generate')
    async generate(@User('username') username: string, @Res() res: Response) {
        this._logger.info(`making structure by ${username}`);
        this._client = this._ldapService.client;
        try {
            await this._client.bind(this._config.AD.USER, this._config.AD.PWD);
            const result = await this
                ._getBlockInfo('CN=IT_block,OU=IT_Org_Group,OU=Groups,DC=ru,DC=com');
            await this._service.save(JSON.stringify(result));
            res.json({
                message: 'success'
            });
        } catch (error) {
            this._logger.error(error);
            res.status(500).json({message: error.toString()});
        } finally {
            await this._client.unbind();
        }
    }

    @Get()
    async get(@Res() res: Response) {
        const json = await this._service.get();
        res.json(json);

    }

    private _getAccountInfo(DN: string): Promise<IAccount> {
        return this._client.search(
            DN,
            {
                filter: '(objectClass=person)',
                attributes: AD_ACCOUNT_SEARCH_ATTRIBUTES,
            })
            .then(({searchEntries}: { searchEntries: Entry[] }) => {
                try {
                    return parseADUserData(searchEntries[0] as IUserEntry);
                } catch (e) {
                    this._logger.error(e);
                    throw e;
                }
            });
    }

    private _getBlockInfo(DN: string): Promise<IStructureBlock> {
        // filter not required groups
        if (!DN.includes('OU=IT_Org_Group')) {
            return null;
        }
        return this._client.search(
            DN,
            {
                scope: 'sub',
                attributes: ['displayName', 'managedBy', 'member', 'labeledURI', 'department'],
            }
        )
            .then(async ({searchEntries}: { searchEntries: Entry[] }) => {
                const [result] = searchEntries;
                let manager: IAccount = null;
                if (isStringValue(result.managedBy)) {
                    manager = await this._getAccountInfo(result.managedBy);
                }
                let member: IStructureBlock[] = [];
                if (result?.member.length > 0) {
                    member = await Promise.all(
                        (result.member as Array<string>).map(i => this._getBlockInfo(i))
                    );
                    member = member
                        .filter(i => !!i)
                        .sort((a, b) => {

                            if (isStringValue(a.department)) {
                                return a.department.localeCompare(b.department) || a.displayName.localeCompare(b.displayName);
                            } else {
                                return a.displayName.localeCompare(b.displayName);
                            }
                        });
                }
                return {
                    displayName: isStringValue(result.displayName) ? result.displayName : '',
                    spaceURL: isStringValue(result.labeledURI) ? result.labeledURI : '',
                    manager,
                    member,
                    department: isStringValue(result.department) ? result.department : '',
                };
            });
    }
}
