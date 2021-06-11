import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';

import {NotificationService} from './notification.service';
import {AppSettings} from '../app-settings.service';

@Injectable({
    providedIn: 'root',
})
export class ApiClientService {
    /**
     * delete empty fields form request
     */
    public static prepareRequest<R>(request: R): any {
        const result = Object.assign({}, request);
        for (const i in request) {
            if (request[i] === null || request[i] === undefined) {
                delete result[i];
            }
        }
        return result;
    }

    constructor(
        private _httpClient: HttpClient,
        private _notificationService: NotificationService,
    ) {}

    public request<R>(method: string = 'GET', url: string, body?: any, params?: any): Observable<R> {
        let preparedParams: HttpParams = null;

        if (params) {
            preparedParams = new HttpParams();
            params = ApiClientService.prepareRequest(params);
            for (const key in params) {
                // eslint-disable-next-line no-prototype-builtins
                if (params.hasOwnProperty(key)) {
                    preparedParams = preparedParams.append(key, params[key]);
                }
            }
        }
        const showId: number = this._notificationService.show();

        return this._httpClient.request<R>(
                method,
                AppSettings.CONFIG.baseURL + url,
                {
                    body,
                    params: preparedParams,
                    responseType: 'json',
                    observe: 'response'
                }
            )
            .pipe(
                map((response: HttpResponse<R>) => response.body),
                finalize(() => this._notificationService.hide(showId))
            );
    }
}
