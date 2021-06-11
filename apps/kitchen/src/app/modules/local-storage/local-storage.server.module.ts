import {NgModule} from '@angular/core';
import {CookieBackendModule} from 'ngx-cookie-backend';

import {LocalStorageService} from './local-storage.interface';
import {LocalStorageServerService} from './local-storage.server.service';

@NgModule({
    imports: [
        CookieBackendModule,
    ],
    providers: [
        {
            provide: LocalStorageService,
            useClass: LocalStorageServerService,
        }
    ],
})
export class LocalStorageServerModule {}
