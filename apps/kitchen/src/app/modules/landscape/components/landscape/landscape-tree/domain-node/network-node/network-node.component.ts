import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {filter, switchMap, tap} from 'rxjs/operators';
import {EditNetworkModalComponent} from '../../../../index';
import {ConfirmModalComponent} from '../../../../../../shared/components/confirm-modal/confirm-modal.component';
import {DomainModel, NetworkModel, NetworkService} from '../../../../../services';
import {CurrentDomainService} from '../current-domain.service';
import {EditHostModalComponent} from './host-node/edit-host-modal/edit-host-modal.component';

@Component({
    selector: 'kitchen-network-node',
    templateUrl: './network-node.component.html',
    styleUrls: ['../../../../general-node.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkNodeComponent implements OnInit {

    @Input() domain: DomainModel;
    @Input() item: NetworkModel;
    @Output() onUpdate: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private _dialogService: MatDialog,
        private _service: NetworkService,
        public currentDomainService: CurrentDomainService,
    ) {
    }

    ngOnInit(): void {
    }

    public edit(): void {
        this._dialogService.open(EditNetworkModalComponent, {
            data: {
                item: this.item,
                parent: this.domain,
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
                content: `Are you sure to delete network ${this.item.name}?`,
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

    public newHost() {
        this._dialogService.open(EditHostModalComponent, {
            data: {
                domain: this.domain,
                parent: this.item,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.onUpdate.emit()),
            )
            .subscribe();
    }
}
