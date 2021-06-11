import {Injectable} from '@angular/core';
import {INetwork} from '@kitchen/api-interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared/crud.service';
import {NetworkModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class NetworkService extends CrudService<NetworkModel, INetwork> {
    protected _prefixUrl = AppSettings.CONFIG.api.landscape.network;
    protected _factory = (data: INetwork) => simpleFactory(NetworkModel, data);

    constructor(
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }

    public create(data: INetwork, domainId: number): Observable<NetworkModel> {
        return this._apiClient.request('post', `${AppSettings.CONFIG.api.landscape.domain}/${domainId}/network`, data)
            .pipe(
                map((result: INetwork) => new NetworkModel(result)),
            );
    }
}
