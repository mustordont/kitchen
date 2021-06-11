import {IAccount} from '@kitchen/api-interfaces';
import {Client} from 'ldapts';
import {Entry} from 'ldapts/messages';
import {Injectable} from '@nestjs/common';

import {AD_FULL_ACCOUNT_SEARCH_ATTRIBUTES, IADAccount, parseADUserData} from './parse-ad-user-data.function';
import {ConfigService} from '../../config';

export type IUserEntry = IADAccount & Entry;

@Injectable()
export class LDAPService {
    private _config: ConfigService;
    constructor(
        config: ConfigService,
    ) {
        this._config = config;
    }

    public get client(): Client {
        return new Client({
            url: this._config.AD.HOST,
            // timeout: 10 * 60000,
            connectTimeout: 600000,
            tlsOptions: {
                minVersion: 'TLSv1',
                rejectUnauthorized: false,
            },
        });
    }

    public async getFullAccountInfo(username: string): Promise<IAccount> {
        const connection = this.client;
        try {
            await connection.bind(this._config.AD.USER, this._config.AD.PWD);
            const {searchEntries}: { searchEntries: Entry[] } = await connection.search(
                this._config.AD.BASEDN,
                {
                    scope: 'sub',
                    filter: `(&(objectClass=person)(sAMAccountName=${username}))`,
                    attributes: AD_FULL_ACCOUNT_SEARCH_ATTRIBUTES,
                }
            );
            return parseADUserData(searchEntries[0] as IUserEntry);
        } catch (e) {
            console.error(e);
            throw new Error(e);
        } finally {
            await connection.unbind();
        }
    }
}

// empty values would be returned as [] such as ldapjs
// https://github.com/ldapts/ldapts/issues/22
// https://github.com/ldapjs/node-ldapjs/blob/master/lib/messages/search_entry.js#L48-L58
export function isStringValue(value: unknown): value is string {
    return typeof value === 'string';
}
