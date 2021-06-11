import {INetwork} from '@kitchen/api-interfaces';
import {IBaseModel} from './base-model.interface';
import {HostModel} from './host.model';

export class NetworkModel implements IBaseModel {
    public readonly id: number;
    public readonly created: Date;
    public readonly production: boolean;
    public readonly base: string;
    public readonly mask: string;
    public readonly vos: number;
    public readonly vlan: number;
    public readonly description: string;
    public readonly hosts: HostModel[] = [];

    // local fields
    public readonly name: string;

    constructor(data: INetwork) {
        this.id = data.id;
        this.created = new Date(data.created);
        this.production = data.production;
        this.base = data.base;
        this.mask = data.mask;
        this.vos = data.vos;
        this.vlan = data.vlan;
        this.description = data.description;

        this.name = `${this.base} / ${this.mask}`;
        if (Array.isArray(data.hosts)) {
            this.hosts = data.hosts.map(i => new HostModel(i));
        }
    }

    public serialize(): INetwork {
        return {
            id: this.id,
            created: this.created.toISOString(),
            production: !!this.production,
            base: this.base,
            mask: this.mask,
            vos: this.vos,
            vlan: this.vlan,
            description: this.description,
            hosts: this.hosts.map(i => i.serialize()),
        };
    }
}
