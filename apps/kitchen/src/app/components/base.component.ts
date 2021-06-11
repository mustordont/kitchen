import {Directive, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Directive()
export abstract class BaseComponent implements OnDestroy {
    protected _onDestroy$: Subject<void> = new Subject<void>();

    ngOnDestroy(): void {
        this._onDestroy$.next();
        this._onDestroy$.complete();
    }
}
