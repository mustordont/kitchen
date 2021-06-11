import {IApplication} from './application.interface';
import {IBaseDomain} from './base-domain.interface';

export interface IGroup extends IBaseDomain {
    name: string;
    applications: IApplication[];
}
