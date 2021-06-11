import {IAccount} from './account.model';

export interface IStructureBlock {
    displayName: string;
    spaceURL?: string;
    manager: IAccount;
    member?: IStructureBlock[];
    department?: string;
}
