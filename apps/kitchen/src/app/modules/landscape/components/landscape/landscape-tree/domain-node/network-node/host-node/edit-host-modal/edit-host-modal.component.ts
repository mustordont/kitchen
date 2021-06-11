import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {IHost} from '@kitchen/api-interfaces';
import {DomainModel, HostModel, HostService, NetworkModel} from '../../../../../../../services';
import {AbstractEditModalComponent} from '../../../../../../abstract-edit-modal.component';

@Component({
    selector: 'kitchen-edit-host-modal',
    templateUrl: './edit-host-modal.component.html',
    styleUrls: ['./edit-host-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: AbstractEditModalComponent.MODAL_CLASS,
    }
})
export class EditHostModalComponent extends AbstractEditModalComponent<IHost, HostModel> {
    public get label(): string {
        return (this._item ? 'Edit' : 'New' ) + ' host';
    }

    protected _item: HostModel;
    public domain: DomainModel;

    public form: FormGroup = new FormGroup({
        applications: new FormControl([]),
        ip: new FormControl(null, [Validators.required]),
        dnsname: new FormControl(null, [Validators.required]),
        os: new FormControl(null, [Validators.required]),
        cpu: new FormControl(null, [Validators.required]),
        ram: new FormControl(null, [Validators.required]),
        hdd: new FormControl(null, [Validators.required]),
        auth: new FormControl(null, [Validators.required]),
        citrix: new FormControl(null, [Validators.required]),
        description: new FormControl(null),
    });

    constructor(
        protected _dialogRef: MatDialogRef<EditHostModalComponent>,
        protected _service: HostService,
        @Inject(MAT_DIALOG_DATA) dialogData: {
            item: HostModel,
            parent: NetworkModel,
            domain: DomainModel,
        },
    ) {
        super();
        this.parent = dialogData.parent;
        this._item = dialogData.item;
        this.domain = dialogData.domain;
        if (this._item) {
            this.form.patchValue({...this._item});
        }
    }
}
