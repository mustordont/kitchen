import {IApplication} from './application.interface';
import {IBaseDomain} from './base-domain.interface';

export interface IKuber extends IBaseDomain {
    namespace: string;
    applications: IApplication[];
}
