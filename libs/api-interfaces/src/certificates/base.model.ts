import {IBaseDomain} from '../landscape';

export class BaseModel {
    public readonly id: number;
    public readonly created?: Date;
    public readonly updated?: Date;
    constructor(data: IBaseDomain) {
        this.id = data.id;
        if (data.created) {
            this.created = new Date(data.created);
        }
        if (data.updated) {
            this.updated = new Date(data.updated);
        }
    }
}
