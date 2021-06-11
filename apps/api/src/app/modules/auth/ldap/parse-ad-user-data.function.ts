import {IAccountGroup, IAccount} from '@kitchen/api-interfaces';

export type ADAccountSearchAttributeType = 'mail' | 'mobile' | 'sAMAccountName' | 'fullName' | 'memberOf' | 'name' | 'birthDate'
    | 'extensionAttribute8' | 'title' | 'department' | 'division' | 'inDate' | 'vkID' | 'thumbnailPhoto;binary';

export const AD_ACCOUNT_SEARCH_ATTRIBUTES: ADAccountSearchAttributeType[] = [
    'mail', 'mobile', 'sAMAccountName', 'fullName',
    'name', 'birthDate', 'extensionAttribute8', 'title',
    'department', 'division', 'inDate', 'vkID', 'thumbnailPhoto;binary'
];

export const AD_FULL_ACCOUNT_SEARCH_ATTRIBUTES: ADAccountSearchAttributeType[] = [
    ...AD_ACCOUNT_SEARCH_ATTRIBUTES, 'memberOf',
];

type AccountAttribute = {
    [index in ADAccountSearchAttributeType]: string;
};

export interface IADAccount extends Pick<AccountAttribute, Exclude<ADAccountSearchAttributeType, 'memberOf'>> {
    memberOf?: string[];
}

export function parseADUserData(data: IADAccount): IAccount {
    function _parseGroups(source: string | string[] = []): IAccountGroup[] {
        const result: IAccountGroup[] = [];
        try {
            const regExp: RegExp = /^CN=(.+?),\w+/;
            if (!Array.isArray(source)) {
                source = [source];
            }
            source.forEach((i: string) => {
                const test = regExp.exec(i);
                if (test && !result.find(j => j.name === test[1])) {
                    result.push({
                        name: test[1],
                        ctx: i.includes('OU=SSLVPN'),
                    });
                }
            });
        } catch (e) {
            console.error(e);
        }
        return result;
    }

    const user: { [key: string]: any } = {};
    AD_FULL_ACCOUNT_SEARCH_ATTRIBUTES.forEach((key: ADAccountSearchAttributeType) => {
        if (key === 'extensionAttribute8') {
            user.city = data.extensionAttribute8;
            return;
        }
        if (key === 'sAMAccountName') {
            user.username = data.sAMAccountName;
            return;
        }
        if (key === 'memberOf') {
            user.groups = _parseGroups(data.memberOf);
            return;
        }
        if (key === 'thumbnailPhoto;binary' && data[key]) {
            user.thumbnailPhoto = Buffer.from(data[key], 'binary').toString('base64');
            return;
        }
        user[key] = data[key];
    });

    return user as IAccount;
}
