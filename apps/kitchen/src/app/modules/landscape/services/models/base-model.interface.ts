import {IBaseDomain} from '@kitchen/api-interfaces';

export interface IBaseModel {
    id: number;
    created: Date;

    serialize: () => IBaseDomain;
}
