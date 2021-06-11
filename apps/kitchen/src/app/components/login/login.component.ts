import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';

import {AuthService} from '../../services';

@Component({
    selector: 'y-login',
    templateUrl: './login.component.html',
    styleUrls: ['login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
    public isBusy: boolean = null;

    public loginForm: FormGroup = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _authService: AuthService,
        private _router: Router,
    ) {
        if (this._authService.isAuthenticated()) {
            this._router.navigate(['account']);
        }
    }

    public login(): void {
        this.isBusy = true;
        this._authService.login(
            this.loginForm.get('login').value,
            this.loginForm.get('password').value
        ).pipe(
            finalize(() => {
                this.isBusy = false;
                this._changeDetectorRef.markForCheck();
            })
        )
            .subscribe(() => {
                this._router.navigate(['account']);
            });
    }
}
