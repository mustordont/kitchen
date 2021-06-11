import {Injectable} from '@angular/core';
import {IApplication, IGroup} from '@kitchen/api-interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared';
import {ApplicationModel, GroupModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService extends CrudService<ApplicationModel, IApplication> {
    protected _prefixUrl = AppSettings.CONFIG.api.landscape.application;
    protected _factory = (data: IApplication) => simpleFactory(ApplicationModel, data);

    constructor(
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }

    public createWithGroup(data: IApplication, groupId: number): Observable<GroupModel> {
        return this._apiClient.request('post', `${AppSettings.CONFIG.api.landscape.group}/${groupId}/application`, data)
            .pipe(
                map((result: IGroup) => new GroupModel(result)),
            );
    }

    public updateWithGroup(group: IGroup, application: IApplication): Observable<GroupModel> {
        return this._apiClient.request('put', this._prefixUrl  + '/' + application.id, {application, group})
            .pipe(
                map((result: IGroup) => new GroupModel(result)),
            );
    }
}
