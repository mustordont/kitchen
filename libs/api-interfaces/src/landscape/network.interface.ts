import {IBaseDomain} from './base-domain.interface';
import {IHost} from './host.interface';

export interface INetwork extends IBaseDomain {
    production: boolean;
    base: string;
    mask: string;
    vos: number;
    vlan: number;
    description: string;
    hosts: IHost[];
}
