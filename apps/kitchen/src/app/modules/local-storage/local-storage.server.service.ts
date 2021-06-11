import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {LocalStorageService} from './local-storage.interface';

@Injectable()
export class LocalStorageServerService implements LocalStorageService {
    constructor(
        private _cookieStorage: CookieService,
    ) {
    }

    public setItem(key: string, value: any): void {
        this._cookieStorage.put(key, value, {
            httpOnly: true,
        });
    }

    public getItem(key: string): any {
        return this._cookieStorage.get(key);
    }

    public removeItem(key: string): void {
        this._cookieStorage.remove(key)
    }
}
