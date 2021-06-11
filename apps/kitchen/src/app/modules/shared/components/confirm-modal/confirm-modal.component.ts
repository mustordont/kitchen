import {ChangeDetectionStrategy, Component, Inject, ViewChild} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'y-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
    @ViewChild('confirm') confirmButton: MatButton;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string;
            content: string;
        },
    ) {}
}
