import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {KitchenService, AccountModel} from '../../../../services';
import {ChoiceModalComponent} from '../choice-modal/choice-modal.component';

@Component({
    selector        : 'y-employee',
    templateUrl     : './employee.component.html',
    styleUrls       : [
        '../user-groups/user-groups.component.scss',
        './employee.component.scss',
    ],
    changeDetection : ChangeDetectionStrategy.OnPush,
})
export class EmployeeComponent {
    @Input() info: AccountModel = null;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _kitchenService: KitchenService,
        private _dialog: MatDialog,
    ) {}

    public openChoice(): void {
        this._dialog.open(ChoiceModalComponent, {
            data: {
                employee: this.info,
            },
            disableClose: true,
            maxHeight: '100vh',
            width: '900px',
        });
    }
}
