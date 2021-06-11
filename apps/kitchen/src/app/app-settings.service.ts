import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, ReplaySubject} from 'rxjs';
import {map, catchError, tap} from 'rxjs/operators';

import {environment} from '../environments/environment';
import {StaticSettings} from './static-settings';
import {makeStateKey, TransferState} from '@angular/platform-browser';

export interface IDynamicConfig {
    baseURL: string;
    choiceURL: string;
}

export type ISettingsConfig = IDynamicConfig & typeof StaticSettings;

@Injectable({
    providedIn: 'root',
})
export class AppSettings {
    public static isBrowser: boolean = true;
    public static ready$: ReplaySubject<void> = new ReplaySubject();

    public static CONFIG: ISettingsConfig = {
        baseURL: '/',
        choiceURL: '/',
        ...StaticSettings,
    };

    constructor(
        private _transferState: TransferState,
        @Inject(PLATFORM_ID) private _platformId,
        private _httpClient: HttpClient,
    ) {
        AppSettings.isBrowser = isPlatformBrowser(_platformId);
    }

    public loadConfig(): Promise<boolean> {
        const CONFIG_KEY = makeStateKey<IDynamicConfig>('config');
        let config$: Observable<IDynamicConfig>;
        if (this._transferState.hasKey(CONFIG_KEY)) {
            config$ = of(this._transferState.get<IDynamicConfig>(CONFIG_KEY, null));
            this._transferState.remove(CONFIG_KEY);
        } else {
            const params: HttpParams = new HttpParams().append('v', new Date().valueOf().toString());
            config$ = this._httpClient.get<IDynamicConfig>(environment.configURL, {params})
                .pipe(
                    tap((config) => {
                        if (!AppSettings.isBrowser) {
                            this._transferState.set(CONFIG_KEY, config);
                        }
                    }),
                );
        }
        return config$
            .pipe(
                map((result: IDynamicConfig) => {
                    Object.assign(AppSettings.CONFIG, result);
                    return true;
                }),
                catchError(() => {
                    console.log('failed get config file, using default values');
                    return of(true);
                }),
                tap(() => AppSettings.ready$.next()),
            )
            .toPromise();
    }

}
