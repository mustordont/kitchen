import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {IAccount} from '@kitchen/api-interfaces';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {mapTo, tap} from 'rxjs/operators';

import {LocalStorageService} from '../modules/local-storage';

import {ILogin} from './interfaces/login.interface';
import {ApiClientService} from './api-client.service';
import {AppSettings} from '../app-settings.service';
import {AccountModel} from './models';


interface IToken {
    exp: number;
    iat: number;
    usr: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public static AUTH_TOKEN: string = 'token';
    private _token: string = null;
    public get token(): string {
        return this._token;
    }

    public set token(value: string) {
        if (value) {
            this._storageService.setItem(AuthService.AUTH_TOKEN, value);
        } else {
            this._storageService.removeItem(AuthService.AUTH_TOKEN);
        }
        this._token = value;
    }
    public accountInfo$: BehaviorSubject<AccountModel> = new BehaviorSubject<AccountModel>(null);

    constructor(
        @Inject(PLATFORM_ID) private _platformId: Object,
        private _transferState: TransferState,
        private _apiClient: ApiClientService,
        private _router: Router,
        private _storageService: LocalStorageService,
    ) {
        // add transfer state
        const token = this._storageService.getItem(AuthService.AUTH_TOKEN);
        if (token) {
            this.token = token;
        }
    }

    public login(username: string, password: string): Observable<ILogin> {
        return this._apiClient.request(
            'POST',
            AppSettings.CONFIG.api.auth.login,
            {
                username,
                password
            }
        )
            .pipe(
                tap((data: ILogin) => {
                    this.token = data.token;
                })
            );
    }

    public refresh(token: string = this._storageService.getItem('token')): void {
        const parsedToken = this._parseJwt(token);
        const refreshTime: number = parsedToken.exp - new Date().valueOf() - 60000;
        setTimeout(
            () => {
                this._apiClient.request(
                    'GET',
                    AppSettings.CONFIG.api.auth.refresh,
                )
                    .subscribe(
                        (data: ILogin) => {
                            this.token = data.token;
                            this.refresh();
                        },
                        () => this.logout()
                    );
            },
            refreshTime);
    }

    public getAccountInfo(): Observable<boolean> {
        const ACCOUNT_INFO_KEY = makeStateKey<IAccount>('ACCOUNT_INFO_KEY');
        let account$: Observable<IAccount>;
        if (this._transferState.hasKey(ACCOUNT_INFO_KEY)) {
            account$ = of(this._transferState.get<IAccount>(ACCOUNT_INFO_KEY, null));
            this._transferState.remove(ACCOUNT_INFO_KEY);
        } else {
            account$ = this._apiClient.request<IAccount>(
                'GET',
                AppSettings.CONFIG.api.account
            )
                .pipe(
                    tap((account) => {
                        if (isPlatformServer(this._platformId)) {
                            this._transferState.set(ACCOUNT_INFO_KEY, account);
                        }
                    })
                );
        }

        return account$
            .pipe(
                tap((result: IAccount) => {
                    this.refresh();
                    this.accountInfo$.next(new AccountModel(result));
                }),
                mapTo(true),
            );
    }


    /**
     * Check if current account have access to required group
     */
    // public isInGroup(group: string): boolean {
    //   group = group.toLowerCase();
    //   return this.accountInfo$.getValue() &&
    //     !!this.accountInfo$.getValue().groups.ad.find((name: string) => name.toLowerCase() === group);
    // }

    public isAuthenticated(): boolean {
        return this.token && this._parseJwt(this.token).exp > new Date().valueOf();
    }

    public logout(navigate: boolean = true): void {
        this.token = null;
        this.accountInfo$.next(null);
        if (navigate) {
            this._router.navigate(['login']);
        }
    }

    private _parseJwt(token = this.token): IToken {
        if (!token) {
            throw new Error('No token provided');
        }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        let parsed = isPlatformServer(this._platformId) ?
            Buffer.from(base64, 'base64').toString('binary')
            : JSON.parse(window.atob(base64));
        parsed = {
            exp: parsed.exp * 1000,
            iat: parsed.iat * 1000,
            username: parsed.username,
        };
        return parsed;
    }
}
