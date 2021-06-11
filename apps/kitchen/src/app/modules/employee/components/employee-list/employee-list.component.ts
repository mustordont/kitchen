import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSelectionList} from '@angular/material/list';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';

import {BaseComponent} from '../../../../components/base.component';
import {AccountModel} from '../../../../services/models';
import {EmployeeService} from '../../services';

@Component({
    selector: 'y-employee-list',
    templateUrl: 'employee-list.component.html',
    styleUrls: ['employee-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent extends BaseComponent {
    public list: AccountModel[] = [];
    public _loaded: boolean = false;

    public query: FormControl = new FormControl(
        '',
        [Validators.required, Validators.minLength(3)]
    );

    @ViewChild(MatSelectionList) selectionList: MatSelectionList;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _employeeService: EmployeeService,
    ) {
        super();
    }

    public makeSearch(): void {
        this.list = [];
        this._loaded = false;
        this._employeeService.search(this.query.value)
            .pipe(
                distinctUntilChanged(),
                takeUntil(this._onDestroy$),
            )
            .subscribe((result: AccountModel[]) => {
                this._loaded = true;
                this.list = result;
                this._changeDetectorRef.markForCheck();
            });
    }

    public trackEmployee(index: number, item: AccountModel): string {
        return String(item.username);
    }
}
