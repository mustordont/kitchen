import {FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {CrudService, IBaseModel} from '../services';
import {compareBaseModels} from './helpers';

export abstract class AbstractEditModalComponent<I, T extends IBaseModel> {
    static MODAL_CLASS: string = 'edit-modal';

    protected abstract _service: CrudService<T, I>;
    protected abstract _dialogRef: MatDialogRef<any>;
    protected _item: T;
    private _parent: IBaseModel;
    protected get parent(): IBaseModel {
        return this._parent;
    }
    protected set parent(value: IBaseModel) {
        this._parent = value;
    }
    public abstract form: FormGroup;

    public update(): void {
        // this._item will be undefined in case of new item
        const data: I = {...this._item?.serialize(), ...this.form.getRawValue()};
        const request$ = this._item ? this._service.update(data) : this._service.create(data, this.parent?.id);
        this.form.disable({emitEvent: false});
        request$
            .pipe(
                finalize(() => this.form.enable({emitEvent: false})),
            )
            .subscribe((result: T) => {
                this._dialogRef.close(result);
            });
    }

    public compareIds = compareBaseModels;
}
