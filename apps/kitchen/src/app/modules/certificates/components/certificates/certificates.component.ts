import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ICertificateFile} from '@kitchen/api-interfaces';
import {Observable, Subject} from 'rxjs';
import {filter, startWith, switchMap, tap} from 'rxjs/operators';
import {CertificateFileModel, CertificateFileService} from '../../services';
import {CertificatesAnalyzeComponent} from './certificates-analyze/certificates-analyze/certificates-analyze.component';

@Component({
    selector: 'kitchen-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificatesComponent implements OnInit {
    public readonly refresh$: Subject<void> = new Subject();
    public readonly files$: Observable<CertificateFileModel[]> = this.refresh$
        .pipe(
            startWith(null),
            switchMap(() => this._service.getAll())
        );

    constructor(
        private _service: CertificateFileService,
        private _dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
    }

    public inputFilesChange(files: FileList) {
        if (files[0]) {
            const formData = new FormData();
            const originalFile = files[0];
            formData.append('file', originalFile);
            this._service.analyze(formData)
                .subscribe((certificates) => {
                    this._dialog.open(CertificatesAnalyzeComponent, {
                        width: '80%',
                        data: {
                            originalFile,
                            certificates,
                        }
                    })
                        .afterClosed()
                        .pipe(
                            filter(Boolean),
                            switchMap((data: ICertificateFile) => this._service.create(data)),
                            tap(() => this.refresh$.next()),
                        )
                        .subscribe()
                });

        }
    }
}
