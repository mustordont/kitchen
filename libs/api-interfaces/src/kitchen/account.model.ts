import {AccountGroup, IAccountGroup} from './account-group.model';

export interface IAccount {
    id?: number;
    name: string;
    fullName: string;
    username: string;
    mail: string;
    mobile: string;
    birthDate: string;
    city: string;
    title: string;
    department: string;
    division: string;
    inDate: string;
    vkID: string;
    thumbnailPhoto?: string;
    groups: IAccountGroup[];
}

export abstract class AccountBase implements IAccount {
    public readonly id?: number;
    public readonly name: string;
    public readonly fullName: string;
    public readonly username: string;
    public readonly mail: string;
    public readonly mobile: string;
    public readonly birthDate: string;
    public readonly city: string;
    public readonly title: string;
    public readonly department: string;
    public readonly division: string;
    public readonly inDate: string;
    public readonly vkID: string;
    public readonly thumbnailPhoto?: string;
    public readonly groups: AccountGroup[];

    constructor(data?: IAccount) {
        // DB Entity will be called without args
        if (!data) {
            return;
        }
        this.name = data.name;
        this.fullName = data.fullName;
        this.username = data.username;
        this.mail = data.mail;
        this.mobile = data.mobile;
        this.birthDate = data.birthDate;
        this.city = data.city;
        this.title = data.title;
        this.department = data.department;
        this.division = data.division;
        this.inDate = data.inDate;
        this.vkID = data.vkID;
        if (data.thumbnailPhoto) {
            this.thumbnailPhoto = data.thumbnailPhoto;
        }
        this.groups = Array.isArray(data.groups) ? data.groups.map(i => new AccountGroup(i)) : [];
    }
}
