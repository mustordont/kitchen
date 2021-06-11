import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    Inject,
    EventEmitter,
    Output,
    Renderer2, Optional
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {ICertificateJob} from '@kitchen/api-interfaces';
import {WINDOW} from '@ng-web-apis/common';
import {filter, switchMap} from 'rxjs/operators';
import {ConfirmModalComponent} from '../../../../shared/components/confirm-modal/confirm-modal.component';
import {CertificateFileModel, CertificateFileService, CertificateModel} from '../../../services';
import {CertificatesComponent} from '../certificates.component';

@Component({
    selector: 'kitchen-certificate-file',
    templateUrl: './certificate-file.component.html',
    styleUrls: ['./certificate-file.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.standalone]': '!parent',
    }
})
export class CertificateFileComponent implements OnInit {
    @Input() item: CertificateFileModel;
    @Output() onDelete: EventEmitter<void> = new EventEmitter();

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        @Inject(WINDOW) private _window: Window,
        private _dialogService: MatDialog,
        private _service: CertificateFileService,
        private _render: Renderer2,
        @Optional() public parent: CertificatesComponent,
    ) {
        if (this._route.snapshot.data.item) {
            this.item = this._route.snapshot.data.item;
        }
    }

    ngOnInit(): void {
    }

    public delete(): void {
        this._dialogService.open(ConfirmModalComponent, {
            data: {
                title: 'Delete',
                content: `Are you sure to delete the <b>${this.item.name}</b> certificate record set?`,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                switchMap(() => {
                    return this._service.delete(this.item.id);
                })
            )
            .subscribe(() => {
                if (this.parent) {
                    this.onDelete.emit();
                } else {
                    this._router.navigate(['certificates']);
                }
            });
    }

    public download() {
        const a: HTMLAnchorElement = this._render.createElement('a');
        a.href = this.item.file;
        a.download = this.item.name;
        a.click();
        a.remove();
    }

    public trackBy(index: number, cert: CertificateModel): number {
        return cert.id;
    }

    public addNew(): void {
        const validFrom: Date = new Date();
        const validTo: Date = new Date();
        validTo.setMonth(validFrom.getMonth() + 1)
        this.item.certs.push(new CertificateModel({
            subject: 'New certificate',
            validFrom: validFrom.toISOString(),
            validTo: validTo.toISOString(),
            alertDate: validFrom.toISOString(),
            jobs: [this._service.newJob()]
        }));
        this._service.update(this.item.serialize())
            .subscribe()
    }
}
