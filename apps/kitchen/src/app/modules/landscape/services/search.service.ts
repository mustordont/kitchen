import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
    ILandscapeSearchPage,
    ILandscapeSearchBaseRequest,
    ILandscapeSearchKuberResult,
    ILandscapeSearchHostRequest
} from '@kitchen/api-interfaces';
import {map} from 'rxjs/operators';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {LandscapeSearchHostResult, LandscapeSearchKuberResult, LandscapeSearchPageModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(
        private _apiClient: ApiClientService,
    ) {
    }

    public searchAppsByKubers(request: ILandscapeSearchBaseRequest): Observable<LandscapeSearchPageModel<ILandscapeSearchKuberResult, LandscapeSearchKuberResult>> {
        return this._apiClient.request('post', AppSettings.CONFIG.api.landscape.search.kuber, request)
            .pipe(
                map((result: ILandscapeSearchPage<ILandscapeSearchKuberResult>) => new LandscapeSearchPageModel(LandscapeSearchKuberResult, result)),
            );
    }

    public searchAppsByHosts(request: ILandscapeSearchBaseRequest): Observable<LandscapeSearchPageModel<ILandscapeSearchHostRequest, LandscapeSearchHostResult>> {
        return this._apiClient.request('post', AppSettings.CONFIG.api.landscape.search.host, request)
            .pipe(
                map((result: ILandscapeSearchPage<ILandscapeSearchHostRequest>) => new LandscapeSearchPageModel(LandscapeSearchHostResult, result)),
            );
    }
}
