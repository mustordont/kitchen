import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {INetwork} from '@kitchen/api-interfaces';
import {DomainModel, NetworkModel, NetworkService} from '../../../../../../services';
import {AbstractEditModalComponent} from '../../../../../abstract-edit-modal.component';

@Component({
    selector: 'kitchen-edit-network-modal',
    templateUrl: './edit-network-modal.component.html',
    styleUrls: ['./edit-network-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: AbstractEditModalComponent.MODAL_CLASS,
    }
})
export class EditNetworkModalComponent extends AbstractEditModalComponent<INetwork, NetworkModel> {
    protected _item: NetworkModel;

    public form: FormGroup = new FormGroup({
        production: new FormControl(false),
        base: new FormControl(null, [Validators.required]),
        mask: new FormControl(null, [Validators.required]),
        vos: new FormControl(null, [Validators.required]),
        vlan: new FormControl(null, [Validators.required]),
        description: new FormControl(null),
    });

    constructor(
        protected _dialogRef: MatDialogRef<EditNetworkModalComponent>,
        protected _service: NetworkService,
        @Inject(MAT_DIALOG_DATA) dialogData: {
            item: NetworkModel,
            parent: DomainModel,
        },
    ) {
        super();
        this.parent = dialogData.parent;
        this._item = dialogData.item;
        if (this._item) {
            this.form.patchValue({...this._item});
        }
    }
}
