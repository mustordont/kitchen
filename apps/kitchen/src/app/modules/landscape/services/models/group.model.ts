import {IGroup} from '@kitchen/api-interfaces';
import {ApplicationModel} from './application.model';
import {IBaseModel} from './base-model.interface';

export class GroupModel implements IBaseModel {
    public readonly id: number;
    public readonly created: Date;
    public readonly name: string;
    public readonly applications: ApplicationModel[] = [];

    constructor(data: IGroup) {
        this.id = data.id;
        this.created = new Date(data.created);
        this.name = data.name;
        if (Array.isArray(data.applications)) {
            this.applications = data.applications.map(i => new ApplicationModel(i));
        }
    }

    public serialize(): IGroup {
        return {
            id: this.id,
            created: this.created.toISOString(),
            name: this.name,
            applications: this.applications.map(i => i.serialize()),
        };
    }
}
