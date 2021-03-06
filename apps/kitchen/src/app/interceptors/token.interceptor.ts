import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services';

/**
 * Add Token to headers
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private _authService: AuthService,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = this._authService.token;
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token,
                }
            });
        }
        return next.handle(request);
    }
}
