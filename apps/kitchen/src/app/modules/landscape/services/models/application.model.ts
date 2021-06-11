import {IApplication} from '@kitchen/api-interfaces';
import {IBaseModel} from './base-model.interface';

export class ApplicationModel implements IBaseModel {
    public readonly id: number;
    public readonly created: Date;
    public readonly name: string;
    public readonly appPort: number;
    public readonly netscalerIP: string;
    public readonly netscalerURL: string;
    public readonly description: string;

    constructor(data: IApplication) {
        this.id = data.id;
        this.created = new Date(data.created);
        this.name = data.name;
        this.appPort = data.appPort;
        this.netscalerIP = data.netscalerIP;
        this.netscalerURL = data.netscalerURL;
        this.description = data.description;
    }

    public serialize(): IApplication {
        return {
            id: this.id,
            created: this.created.toISOString(),
            name: this.name,
            appPort: this.appPort,
            netscalerIP: this.netscalerIP,
            netscalerURL: this.netscalerURL,
            description: this.description,
        };
    }
}
