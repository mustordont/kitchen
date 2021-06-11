import {Injectable} from '@angular/core';
import {IHost} from '@kitchen/api-interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared/crud.service';
import {HostModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class HostService extends CrudService<HostModel, IHost> {
    protected _prefixUrl = AppSettings.CONFIG.api.landscape.host;
    protected _factory = (data: IHost) => simpleFactory(HostModel, data);

    constructor(
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }

    public create(data: IHost, networkId: number): Observable<HostModel> {
        return this._apiClient.request('post', `${AppSettings.CONFIG.api.landscape.network}/${networkId}/host`, data)
            .pipe(
                map((result: IHost) => new HostModel(result)),
            );
    }

    public search(dnsname: string): Observable<HostModel[]> {
        return this._apiClient.request('get', `${this._prefixUrl}/search`, null, {dnsname})
            .pipe(
                map((result: IHost[]) => result.map(i => new HostModel(i))),
            );
    }
}
