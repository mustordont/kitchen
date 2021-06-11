import {IKuber} from '@kitchen/api-interfaces';
import {ApplicationModel} from './application.model';
import {IBaseModel} from './base-model.interface';

export class KuberModel implements IBaseModel {
    public readonly id: number;
    public readonly created: Date;
    public readonly namespace: string;
    public readonly applications: ApplicationModel[] = [];

    constructor(data: IKuber) {
        this.id = data.id;
        this.created = new Date(data.created);
        this.namespace = data.namespace;

        if (Array.isArray(data.applications)) {
            this.applications = data.applications.map(i => new ApplicationModel(i));
        }
    }

    public serialize(): IKuber {
        return {
            id: this.id,
            created: this.created.toISOString(),
            namespace: this.namespace,
            applications: this.applications.map(i => i.serialize()),
        };
    }

    toString(): string {
        return this.namespace;
    }
}
