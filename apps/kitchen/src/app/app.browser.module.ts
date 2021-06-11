import {NgModule} from '@angular/core';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppModule} from './app.module';
import {LocalStorageBrowserModule} from './modules/local-storage/local-storage.browser.module';

import {RootComponent} from './components/root/root.component';

@NgModule({
    imports: [
        // Add .withServerTransition() to support Universal rendering.
        // The application ID can be any identifier which is unique on
        // the page.
        AppModule,
        BrowserModule.withServerTransition({appId: 'y-app'}),
        BrowserTransferStateModule,
        BrowserAnimationsModule,
        LocalStorageBrowserModule,
    ],
    bootstrap: [RootComponent],
})
export class AppBrowserModule {
}
