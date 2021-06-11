import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {of} from 'rxjs';
import {catchError, debounceTime, filter, map, skip, switchMap, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../../components';
import {AuthService} from '../../../../services';
import {CertificateJobModel, CertificateModel, CertificateService} from '../../services';

@Component({
    selector: 'kitchen-certificate',
    templateUrl: './certificate.component.html',
    styleUrls: ['./certificate.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateComponent extends BaseComponent implements OnInit {
    public form: FormGroup = new FormGroup({
        active: new FormControl(true),
        subject: new FormControl('', Validators.required),
        validFrom: new FormControl(null),
        validTo: new FormControl(null),
        alertDate: new FormControl(null),
        jobs: new FormControl([])
    });

    @Input() item: CertificateModel;
    @Output() update: EventEmitter<CertificateModel> = new EventEmitter<CertificateModel>();

    constructor(
        private _authService: AuthService,
        private _service: CertificateService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.form.patchValue(this.item, {emitEvent: false});

        this.form.valueChanges
            .pipe(
                debounceTime(1000),
                skip(1),
                map(({active, subject, validFrom, validTo, alertDate, jobs}: {
                    active: boolean,
                    subject: string,
                    validFrom?: Date,
                    validTo?: Date,
                    alertDate?: Date,
                    jobs: CertificateJobModel[],
                }) => new CertificateModel({
                    id: this.item.id,
                    active,
                    subject,
                    validFrom: validFrom?.toISOString(),
                    validTo: validTo?.toISOString(),
                    alertDate: alertDate?.toISOString(),
                    jobs: jobs.map(i => i.serialize()),
                })),
                tap((model: CertificateModel) => this.update.emit(model)),
                filter(() => Boolean(this.item?.id)),
                switchMap((model: CertificateModel) => this._service.update(model.serialize())),
                catchError(() => of(null)),
                takeUntil(this._onDestroy$),
            )
            .subscribe();
    }

    public updateJobs(newLastJob: CertificateJobModel): void {
        const arr = this.form.get('jobs').value;
        arr.splice(-1, 1, newLastJob);
        this.form.get('jobs').patchValue(arr.slice());
    }
}
