import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CertificateModel} from '../../../../services';

@Component({
    selector: 'kitchen-certificates-analyze',
    templateUrl: './certificates-analyze.component.html',
    styleUrls: ['./certificates-analyze.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesAnalyzeComponent implements OnInit {
    public name: FormControl = new FormControl(this.data.originalFile.name, Validators.required);

    constructor(
        private _dialogRef: MatDialogRef<CertificatesAnalyzeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            originalFile: File,
            certificates: CertificateModel[],
        },
    ) {
    }

    ngOnInit(): void {

    }

    public update(cert: CertificateModel, index: number): void {
        this.data.certificates[index] = cert;
    }

    public submit() {
        const reader = new FileReader();
        reader.readAsDataURL(this.data.originalFile);
        reader.onloadend = (res) => {
            const file = res.target.result;
            this._dialogRef.close({
                name: this.name.value,
                file,
                certs: this.data.certificates.filter(i => i.active).map(i => i.serialize()),
            });
        }
    }

    public trackBy(index: number, cert: CertificateModel): number {
        return cert.id;
    }
}
