import {Injectable} from '@angular/core';
import {IDomain} from '@kitchen/api-interfaces';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared/crud.service';
import {DomainModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class DomainService extends CrudService<DomainModel, IDomain> {
    protected _prefixUrl = AppSettings.CONFIG.api.landscape.domain;
    protected _factory = (data: IDomain) => simpleFactory(DomainModel, data);

    constructor(
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }
}
