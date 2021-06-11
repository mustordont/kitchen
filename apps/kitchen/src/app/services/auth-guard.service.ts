import {Injectable} from '@angular/core';
import {Router, CanActivate, UrlTree} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable, of} from 'rxjs';
import {catchError, first, mapTo, switchMap} from 'rxjs/operators';
import {AppSettings} from '../app-settings.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    private _loginUrl: UrlTree = this._router.createUrlTree(['login']);

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> {
        if (!this._authService.isAuthenticated()) {
            this._authService.logout(false);
            return of(this._loginUrl);
        } else if (!this._authService.accountInfo$.getValue()) {
            return AppSettings.ready$
                .pipe(
                    switchMap(() => this._authService.getAccountInfo()
                        .pipe(
                            first(),
                            mapTo(true),
                            catchError((err) => {
                                this._authService.logout(false);
                                return of(this._loginUrl);
                            }),
                        )
                    )
                );
        } else {
            return of(true);
        }
    }
}
