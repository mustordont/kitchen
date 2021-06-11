import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IApplication} from '@kitchen/api-interfaces';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {ApplicationModel, ApplicationService, DomainModel, GroupModel} from '../../../../../services';
import {AbstractEditModalComponent} from '../../../../abstract-edit-modal.component';

@Component({
    selector: 'kitchen-edit-application-modal',
    templateUrl: './edit-application-modal.component.html',
    styleUrls: ['./edit-application-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: AbstractEditModalComponent.MODAL_CLASS,
    }
})
export class EditApplicationModalComponent extends AbstractEditModalComponent<IApplication, ApplicationModel> {
    public get label(): string {
        return (this._item ? 'Edit' : 'New' ) + ' application';
    }
    public group: FormControl = new FormControl(null, [Validators.required]);
    public form: FormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required]),
        appPort: new FormControl(null, [Validators.required]),
        netscalerIP: new FormControl(null, [Validators.required]),
        netscalerURL: new FormControl(null, [Validators.required]),
        description: new FormControl(null),
    });

    public domain: DomainModel;
    protected _item: ApplicationModel;
    protected get parent(): GroupModel {
        return this.group.value;
    }

    protected set parent(value: GroupModel) {
        this.group.setValue(value);
    }

    constructor(
        protected _dialogRef: MatDialogRef<EditApplicationModalComponent>,
        protected _service: ApplicationService,
        @Inject(MAT_DIALOG_DATA) dialogData: {
            item: ApplicationModel,
            domain: DomainModel,
            group: GroupModel,
        },
    ) {
        super();
        this.domain = dialogData.domain;
        this._item = dialogData?.item;
        if (this._item) {
            this.form.patchValue({...this._item});
            this.group.patchValue(dialogData.group);
        }
    }

    public update(): void {
        // this._item will be undefined in case of new item
        const data: IApplication = {...this._item?.serialize(), ...this.form.getRawValue()};
        const request$: Observable<GroupModel> = this._item ? this._service.updateWithGroup(this.group.value, data) : this._service.createWithGroup(data, this.parent?.id);
        this.group.disable({emitEvent: false});
        this.form.disable({emitEvent: false});

        request$
            .pipe(
                finalize(() => {
                    this.group.enable({emitEvent: false});
                    this.form.enable({emitEvent: false});
                }),
            )
            .subscribe((group: GroupModel) => {
                this._dialogRef.close(group);
            });
    }
}
