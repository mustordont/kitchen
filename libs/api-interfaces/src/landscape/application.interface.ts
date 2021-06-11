import {IBaseDomain} from './base-domain.interface';

export interface IApplication extends IBaseDomain {
    name: string;
    appPort: number;
    netscalerIP: string;
    netscalerURL: string;
    description: string;
}
