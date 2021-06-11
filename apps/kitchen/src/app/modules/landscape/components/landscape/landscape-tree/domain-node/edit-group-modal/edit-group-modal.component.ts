import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IGroup} from '@kitchen/api-interfaces';
import {DomainModel, GroupModel, GroupService} from '../../../../../services';
import {AbstractEditModalComponent} from '../../../../abstract-edit-modal.component';

@Component({
    selector: 'kitchen-edit-group-modal',
    templateUrl: './edit-group-modal.component.html',
    styleUrls: ['./edit-group-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: AbstractEditModalComponent.MODAL_CLASS,
    }
})
export class EditGroupModalComponent extends AbstractEditModalComponent<IGroup, GroupModel> {
    public get label(): string {
        return (this._item ? 'Edit' : 'New' ) + ' group';
    }

    protected _item: GroupModel;

    public form: FormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required]),
    });

    constructor(
        protected _service: GroupService,
        protected _dialogRef: MatDialogRef<EditGroupModalComponent>,
        @Inject(MAT_DIALOG_DATA) dialogData: {
            item: GroupModel,
            parent: DomainModel,
        },
    ) {
        super();
        this.parent = dialogData.parent;
        this._item = dialogData?.item;
        if (this._item) {
            this.form.patchValue({
                name: this._item.name,
            });
        }
    }
}
