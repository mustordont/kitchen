import {Injectable} from '@angular/core';
import {IAbout} from '@kitchen/api-interfaces';
import {Observable} from 'rxjs';
import {map, pluck, shareReplay} from 'rxjs/operators';
import {AppSettings} from '../app-settings.service';
import {ApiClientService} from './api-client.service';
import {version} from '../../../package.json';

export interface IAboutFull extends IAbout {
    authors: string[];
    apiVersion: string;
    frontVersion: string;
}

@Injectable({
    providedIn: 'root',
})
export class KitchenService {
    private _aboutInfo$: Observable<IAboutFull>;
    public get aboutInfo$(): Observable<IAboutFull> {
        if (!this._aboutInfo$) {
            this._aboutInfo$ = this._getAbout()
                .pipe(
                    map((res: IAbout) => ({
                        ...res,
                        frontVersion: version,
                    })),
                    shareReplay(),
                );
        }
        return this._aboutInfo$;
    }

    constructor(
        private _apiClient: ApiClientService,
    ) {
    }

    private _getAbout(): Observable<IAbout> {
        return this._apiClient.request('GET', AppSettings.CONFIG.api.about);
    }

    public getChoiceSign(vk_user_id: string): Observable<string> {
        return this._apiClient.request(
            'POST',
            AppSettings.CONFIG.api.choiceSign,
            {
                vk_user_id,
            }
        )
            .pipe(
                pluck('sign'),
            );
    }

    public generateStructure(): Observable<void> {
        return this._apiClient.request('GET', AppSettings.CONFIG.api.structure.generate);
    }
}
