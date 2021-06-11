import {IDomain} from '@kitchen/api-interfaces';
import {ApplicationModel} from './application.model';
import {IBaseModel} from './base-model.interface';
import {GroupModel} from './group.model';
import {KuberModel} from './kuber.model';
import {NetworkModel} from './network.model';

export class DomainModel implements IBaseModel {
    public readonly id: number;
    public readonly name: string;
    public readonly created: Date;
    public readonly groups: GroupModel[] = [];
    public readonly kubers: KuberModel[] = [];
    public readonly networks: NetworkModel[] = [];

    // front logic fields
    public readonly applications: ApplicationModel[] = [];

    constructor(data: IDomain) {
        this.id = data.id;
        this.name = data.name;
        this.created = new Date(data.created);
        if (Array.isArray(data.groups)) {
            this.groups = data.groups.map(i => new GroupModel(i));
            this.applications = this.groups.reduce((acc: ApplicationModel[], cur: GroupModel) => acc.concat(cur.applications), []);
        }
        if (Array.isArray(data.kubers)) {
            this.kubers = data.kubers.map(i => new KuberModel(i));
        }
        if (Array.isArray(data.networks)) {
            this.networks = data.networks.map(i => new NetworkModel(i));
        }
    }

    public serialize(): IDomain {
        return {
            id: this.id,
            name: this.name,
            created: this.created.toISOString(),
            groups: this.groups.map(i => i.serialize()),
            kubers: this.kubers.map(i => i.serialize()),
            networks: this.networks.map(i => i.serialize()),
        }
    }
}
