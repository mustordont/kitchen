import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {filter, switchMap, tap} from 'rxjs/operators';
import {ConfirmModalComponent} from '../../../../../../../shared/components/confirm-modal/confirm-modal.component';
import {HostService, HostModel, NetworkModel} from '../../../../../../services';
import {CurrentDomainService} from '../../current-domain.service';
import {EditHostModalComponent} from './edit-host-modal/edit-host-modal.component';

@Component({
    selector: 'kitchen-host-node',
    templateUrl: './host-node.component.html',
    styleUrls: ['../../../../../general-node.scss',  './host-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostNodeComponent implements OnInit {

    @Input() network: NetworkModel;
    @Input() item: HostModel;

    @Output() onUpdate: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private _dialogService: MatDialog,
        private _service: HostService,
        private _currentDomainService: CurrentDomainService,
    ) {
    }

    ngOnInit(): void {
    }

    public edit(): void {
        this._dialogService.open(EditHostModalComponent, {
            data: {
                item: this.item,
                parent: this.network,
                domain: this._currentDomainService.domain,
            },
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.onUpdate.emit()),
            )
            .subscribe();
    }

    public delete(): void {
        this._dialogService.open(ConfirmModalComponent, {
            data: {
                title: 'Delete',
                content: `Are you sure to delete host ${this.item.ip}?`,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                switchMap(() => {
                    return this._service.delete(this.item.id);
                }),
                tap(() => this.onUpdate.emit()),
            )
            .subscribe();
    }
}
