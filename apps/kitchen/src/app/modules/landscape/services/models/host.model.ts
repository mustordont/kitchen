import {IHost} from '@kitchen/api-interfaces';
import {ApplicationModel} from './application.model';
import {IBaseModel} from './base-model.interface';

export class HostModel implements IBaseModel {
    public readonly id: number;
    public readonly created: Date;
    public readonly ip: string;
    public readonly dnsname: string;
    public readonly os: string;
    public readonly cpu: number;
    public readonly ram: number;
    public readonly hdd: number;
    public readonly auth: string;
    public readonly citrix: string;
    public readonly description: string;

    public readonly applications: ApplicationModel[] = [];

    constructor(data: IHost) {
        if (Array.isArray(data.applications) && !!data.applications.length) {
           this.applications = data.applications.map(i => new ApplicationModel(i));
        }
        this.id = data.id;
        this.created = new Date(data.created);
        this.ip = data.ip;
        this.dnsname = data.dnsname;
        this.os = data.os;
        this.cpu = data.cpu;
        this.ram = data.ram;
        this.hdd = data.hdd;
        this.auth = data.auth;
        this.citrix = data.citrix;
        this.description = data.description;
    }

    public serialize(): IHost {
        return {
            id: this.id,
            created: this.created.toISOString(),
            ip: this.ip,
            dnsname: this.dnsname,
            os: this.os,
            cpu: this.cpu,
            ram: this.ram,
            hdd: this.hdd,
            auth: this.auth,
            citrix: this.citrix,
            description: this.description,
            applications: this.applications.map(i => i.serialize()),
        };
    }
}
