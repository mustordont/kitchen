import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { CookieBackendModule } from 'ngx-cookie-backend';

import {AppModule} from './app.module';
import {UniversalInterceptor} from './interceptors';
import {RootComponent} from './components/root/root.component';
import {LocalStorageServerModule} from './modules/local-storage/local-storage.server.module';

@NgModule({
    imports: [
        AppModule,
        CookieBackendModule.forRoot(),
        ServerModule,
        ServerTransferStateModule,
        LocalStorageServerModule,
        NoopAnimationsModule,
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [RootComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UniversalInterceptor,
            multi: true // <-- important (you can have many interceptors)
        },
    ]
})
export class AppServerModule {
}
