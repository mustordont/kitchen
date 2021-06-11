import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CERTIFICATE_JOB_SEPARATOR, ECertificateJobStatus} from '@kitchen/api-interfaces';
import {CertificateJobModel} from '../../../services';

@Component({
    selector: 'kitchen-edit-certificate-job',
    templateUrl: './edit-certificate-job.component.html',
    styleUrls: ['./edit-certificate-job.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCertificateJobComponent implements OnInit {
    public lastJob: CertificateJobModel = EditCertificateJobComponent.lastJob(this.data.jobs);

    public static lastJob(jobs: CertificateJobModel[]): CertificateJobModel | null {
        if (jobs.length) {
            return jobs[jobs.length - 1];
        } else {
            return null;
        }
    }

    public emails: string[] = this.lastJob.emails.split(CERTIFICATE_JOB_SEPARATOR);

    public email = new FormControl('', Validators.email);

    @ViewChild('chipList', {read: MatChipList}) chipList: MatChipList;

    constructor(
        private _dialogRef: MatDialogRef<EditCertificateJobComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            jobs: CertificateJobModel[],
        }
    ) {
    }

    ngOnInit(): void {
    }

    add(event: MatChipInputEvent): void {
        this.chipList.errorState = this.email.invalid;
        if (!this.chipList.errorState) {
            const value = (event.value || '').trim();

            // Add our fruit
            if (value) {
                this.emails.push(value);
            }

            // Clear the input value
            event.input!.value = '';
        }
    }

    remove(value: string): void {
        const index = this.emails.indexOf(value);

        if (index >= 0) {
            this.emails.splice(index, 1);
        }
    }

    public submit(): void {
        this._dialogRef.close(
            new CertificateJobModel({
                emails: this.emails.join(CERTIFICATE_JOB_SEPARATOR),
                status: ECertificateJobStatus.PENDING,
            })
        );
    }

}
