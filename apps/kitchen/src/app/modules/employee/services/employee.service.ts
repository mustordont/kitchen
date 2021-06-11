import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IAccount} from '@kitchen/api-interfaces';

import {ApiClientService, AccountModel} from '../../../services';
import {AppSettings} from '../../../app-settings.service';

@Injectable()
export class EmployeeService {
    constructor(
        private _apiClient: ApiClientService,
    ) {
    }

    public search(query: string): Observable<AccountModel[]> {
        return this._apiClient.request(
            'POST',
            AppSettings.CONFIG.api.employee.search,
            {
                query
            }
        )
            .pipe(
                map((result: IAccount[]) => result.map((i: IAccount) => new AccountModel(i))),
            );
    }
}
