import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {CertificateJobModel} from '../../../services';

@Component({
    selector: 'kitchen-certificate-job',
    templateUrl: './certificate-job.component.html',
    styleUrls: ['./certificate-job.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateJobComponent implements OnInit {
    @Input() item: CertificateJobModel;

    constructor() {
    }

    ngOnInit(): void {
    }

}
