import {Injectable} from '@angular/core';
import {AppSettings} from '../../app-settings.service';
import {LocalStorageService} from './local-storage.interface';

@Injectable()
export class LocalStorageBrowserService implements LocalStorageService {

    public setItem(key: string, value: any): void {
        localStorage.setItem(`${AppSettings.CONFIG.branch}:${key}`, JSON.stringify(value));
    }

    public getItem(key: string): any {
        return JSON.parse(localStorage.getItem(`${AppSettings.CONFIG.branch}:${key}`));
    }

    public removeItem(key: string): any {
        localStorage.removeItem(`${AppSettings.CONFIG.branch}:${key}`);
    }
}
