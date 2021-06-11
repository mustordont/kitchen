import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {delay, filter, map, mergeMap} from 'rxjs/operators';

import {routerTransition} from '../../modules/shared/animations';
import {AuthService, NotificationService} from '../../services';
import {AboutComponent} from '../about/about.component';

@Component({
    selector: 'y-kitchen',
    templateUrl: './kitchen.component.html',
    styleUrls: ['./kitchen.component.scss'],
    animations: [routerTransition],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenComponent {
    public busy: boolean = false;
    public title: string = null;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _route: ActivatedRoute,
        private _dialog: MatDialog,
        public authService: AuthService,
        private _notificationService: NotificationService,
    ) {

        this._notificationService.isBusy$
            .pipe(
                delay(0),
            )
            .subscribe((value) => {
                this.busy = value;
                this._changeDetectorRef.markForCheck();
            });

        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this._route),
                map((route) => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }),
                filter((route) => route.outlet === 'primary'),
                mergeMap((route) => route.data)
            )
            .subscribe((data) => {
                this.title = data.title ? data.title : 'Apps Kitchen';
                this._changeDetectorRef.markForCheck();
            });
    }

    public showInfo() {
        this._dialog.open(AboutComponent);
    }

    public getState(outlet) {
        // can return more compehensive info for transition
        // return outlet.activatedRouteData.state;
        return outlet.isActivated && outlet.activatedRoute.routeConfig.path;
    }
}
