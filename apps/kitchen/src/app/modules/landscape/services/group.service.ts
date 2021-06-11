import {Injectable} from '@angular/core';
import {IGroup} from '@kitchen/api-interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared/crud.service';
import {GroupModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class GroupService extends CrudService<GroupModel, IGroup> {
    protected _prefixUrl = AppSettings.CONFIG.api.landscape.group;
    protected _factory = (data: IGroup) => simpleFactory(GroupModel, data);

    constructor(
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }

    public create(data: IGroup, domainId: number): Observable<GroupModel> {
        return this._apiClient.request('post', `${AppSettings.CONFIG.api.landscape.domain}/${domainId}/group`, data)
            .pipe(
                map((result: IGroup) => new GroupModel(result)),
            );
    }
}
