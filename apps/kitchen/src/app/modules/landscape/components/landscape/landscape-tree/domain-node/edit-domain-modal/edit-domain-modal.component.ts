import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IDomain} from '@kitchen/api-interfaces';
import {DomainModel, DomainService} from '../../../../../services';
import {AbstractEditModalComponent} from '../../../../abstract-edit-modal.component';

@Component({
    selector: 'kitchen-edit-domain-modal',
    templateUrl: './edit-domain-modal.component.html',
    styleUrls: ['./edit-domain-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: AbstractEditModalComponent.MODAL_CLASS
    }
})
export class EditDomainModalComponent extends AbstractEditModalComponent<IDomain, DomainModel> {
    public get label(): string {
        return (this._item ? 'Edit' : 'New' ) + ' domain';
    }
    protected _item: DomainModel;

    public form: FormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required]),
    });

    constructor(
        protected _dialogRef: MatDialogRef<EditDomainModalComponent>,
        protected _service: DomainService,
        @Inject(MAT_DIALOG_DATA) dialogData: {
            item: DomainModel,
        },
    ) {
        super();
        this._item = dialogData?.item;
        if (this._item) {
            this.form.patchValue({
                name: this._item.name,
            });
        }
    }
}
