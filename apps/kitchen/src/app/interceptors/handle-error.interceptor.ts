import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthService, NotificationService, APIException} from '../services';

/**
 * Catch Http Error
 */
@Injectable()
export class HandleErrorInterceptor implements HttpInterceptor {
    constructor(
        private _authService: AuthService,
        private _notificationService: NotificationService,
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((errorResponse: HttpErrorResponse) => {
                    console.error(errorResponse);
                    const error = errorResponse.error ? new APIException(errorResponse.error) : errorResponse.message;
                    this._notificationService.showSnack(error);
                    if (errorResponse.status === 401) {
                        this._authService.logout();
                    }

                    return throwError(error);
                })
            );
    }
}
