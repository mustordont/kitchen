import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {IKuber} from '@kitchen/api-interfaces';
import {ApplicationModel, DomainModel, GroupModel, KuberModel, KuberService} from '../../../../../../services';
import {AbstractEditModalComponent} from '../../../../../abstract-edit-modal.component';

@Component({
    selector: 'kitchen-edit-host-modal',
    templateUrl: './edit-kuber-modal.component.html',
    styleUrls: ['./edit-kuber-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: AbstractEditModalComponent.MODAL_CLASS,
    },
})
export class EditKuberModalComponent extends AbstractEditModalComponent<IKuber, KuberModel> {
    public get label(): string {
        return (this._item ? 'Edit' : 'New' ) + ' kubernetes';
    }

    protected _item: KuberModel;
    public applications: ApplicationModel[] = [];
    public group: GroupModel;

    public form: FormGroup = new FormGroup({
        group: new FormControl(null),
        applications: new FormControl([]),
        namespace: new FormControl(null, [Validators.required]),
        description: new FormControl(),
    });

    constructor(
        protected _dialogRef: MatDialogRef<EditKuberModalComponent>,
        @Inject(MAT_DIALOG_DATA) dialogData: {
            item: KuberModel,
            parent: DomainModel,
            group: GroupModel,
        },
        protected _service: KuberService,
    ) {
        super();
        this.parent = dialogData.parent;
        this._item = dialogData.item;
        if (this._item) {
            this.form.patchValue({...this._item});
        }
        this.applications = dialogData.parent.applications;
        this.group = dialogData.group;
    }
}
