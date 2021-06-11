import {EModules} from '@kitchen/api-interfaces';
import {ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {Entry} from 'ldapts/messages';
import {Body, Controller, Post, Res, UseGuards} from '@nestjs/common';

import {
    AD_FULL_ACCOUNT_SEARCH_ATTRIBUTES,
    ADGroupsGuard,
    ConfigService,
    EREQUIRED_GROUPS,
    IUserEntry,
    LDAPService, LoggerService,
    parseADUserData,
    RequiredADGroups, User,
} from '../modules';

@ApiTags(EModules.KITCHEN)
@RequiredADGroups(EREQUIRED_GROUPS.EMPLOYEE)
@UseGuards(ADGroupsGuard)
@Controller('employee')
export class EmployeeController {
    constructor(
        private _logger: LoggerService,
        private _config: ConfigService,
        private _ldapService: LDAPService,
    ) {
    }

    @Post('search')
    async search(@User('username') username: string, @Body() {query}: { query: string }, @Res() res: Response) {
        this._logger.info(`${username} is looking for: ${query}`);
        const client = this._ldapService.client;
        try {
            await client.bind(this._config.AD.USER, this._config.AD.PWD);
            const {searchEntries}: { searchEntries: Entry[] } = await client.search(
                this._config.AD.BASEDN,
                {
                    scope: 'sub',
                    filter: `(&(objectClass=person)(|(sAMAccountName=*${query}*)(mobile=*${query}*)(extensionAttribute8=*${query}*)(fullName=*${query}*)))`,
                    attributes: AD_FULL_ACCOUNT_SEARCH_ATTRIBUTES,
                }
            );
            res.json(
                searchEntries.map(i => parseADUserData(i as IUserEntry))
            );
        } catch (error) {
            this._logger.error(error);
            res.status(500).json({message: error.toString()});
        } finally {
            await client.unbind();
        }
    }
}
