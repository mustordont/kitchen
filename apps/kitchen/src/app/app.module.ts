import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {
    RootComponent,
    LoginComponent,
    SettingsComponent,
    KitchenComponent, AboutComponent
} from './components';

import {SharedModule} from './modules/shared/shared.module';

import {AuthGuardService} from './services';
import {HandleErrorInterceptor, TokenInterceptor} from './interceptors';
import {AppSettings} from './app-settings.service';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
    imports: [
        HttpClientModule,
        SharedModule,
        AppRoutingModule,
        MatSnackBarModule,
    ],
    declarations: [
        AboutComponent,
        RootComponent,
        KitchenComponent,
        LoginComponent,
        SettingsComponent,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (config: AppSettings) => () => config.loadConfig(),
            deps: [AppSettings],
            multi: true,
        },
        {provide: LOCALE_ID, useValue: 'ru'},
        AuthGuardService,
        {provide: HTTP_INTERCEPTORS, useClass: HandleErrorInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    ],
})
export class AppModule {
}
