import {IApplication} from './application.interface';
import {IBaseDomain} from './base-domain.interface';

export interface IHost extends IBaseDomain {
    ip: string;
    dnsname: string;
    os: string;
    cpu: number;
    ram: number;
    hdd: number;
    auth: string;
    citrix: string;
    description: string;

    applications: IApplication[];
}
