import {Injectable} from '@angular/core';
import {IKuber} from '@kitchen/api-interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared/crud.service';
import {KuberModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class KuberService extends CrudService<KuberModel, IKuber> {
    protected _prefixUrl = AppSettings.CONFIG.api.landscape.kuber;
    protected _factory = (data: IKuber) => simpleFactory(KuberModel, data);

    constructor(
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }

    public create(data: IKuber, domainId: number): Observable<KuberModel> {
        return this._apiClient.request('post', `${AppSettings.CONFIG.api.landscape.domain}/${domainId}/kuber`, data)
            .pipe(
                map((result: IKuber) => new KuberModel(result)),
            );
    }

    public search(namespace: string): Observable<KuberModel[]> {
        return this._apiClient.request('get', `${this._prefixUrl}/search`, null, {namespace})
            .pipe(
                map((result: IKuber[]) => result.map(i => new KuberModel(i))),
            );
    }
}
