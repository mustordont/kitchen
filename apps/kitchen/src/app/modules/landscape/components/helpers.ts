import {IBaseDomain} from '@kitchen/api-interfaces';

export function compareBaseModels(o1: IBaseDomain, o2: IBaseDomain): boolean {
    return o1?.id === o2?.id;
}
