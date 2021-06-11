import {NgModule} from '@angular/core';

import {LocalStorageService} from './local-storage.interface';
import {LocalStorageBrowserService} from './local-storage.browser.service';

@NgModule({
    providers: [
        {
            provide: LocalStorageService,
            useClass: LocalStorageBrowserService,
        }
    ],
})
export class LocalStorageBrowserModule {}
