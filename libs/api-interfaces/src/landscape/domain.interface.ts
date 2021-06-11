import {IBaseDomain} from './base-domain.interface';
import {IGroup} from './group.interface';
import {IKuber} from './kuber.interface';
import {INetwork} from './network.interface';

export interface IDomain extends IBaseDomain {
    name: string;
    groups: IGroup[];
    kubers: IKuber[];
    networks: INetwork[];
}
