import {Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {filter} from 'rxjs/operators';
import {CertificateJobModel} from '../../../services';
import {EditCertificateJobComponent} from '../edit-certificate-job/edit-certificate-job.component';

@Component({
    selector: 'kitchen-last-certificate-job',
    templateUrl: './last-certificate-job.component.html',
    styleUrls: ['./last-certificate-job.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LastCertificateJobComponent implements OnInit {
    public lastJob: CertificateJobModel;
    private _jobs: CertificateJobModel[] = [];
    @Input() set jobs(value: CertificateJobModel[]) {
        if (Array.isArray(value)) {
            this._jobs = value;
            this.lastJob = EditCertificateJobComponent.lastJob(this.jobs);
        }
    }
    get jobs(): CertificateJobModel[] {
        return this._jobs;
    }

    @Output() update: EventEmitter<CertificateJobModel[]> = new EventEmitter();

    constructor(
        private _dialogRef: MatDialog,
    ) {
    }

    ngOnInit(): void {

    }

    public edit() {
        this._dialogRef.open(EditCertificateJobComponent, {
            data: {
                jobs: this.jobs,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
            )
            .subscribe((res: CertificateJobModel[]) => {
                this.update.emit(res);
            })
    }
}
