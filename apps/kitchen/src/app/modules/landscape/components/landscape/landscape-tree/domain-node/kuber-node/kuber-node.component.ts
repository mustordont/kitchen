import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {filter, switchMap, tap} from 'rxjs/operators';
import {ConfirmModalComponent} from '../../../../../../shared/components/confirm-modal/confirm-modal.component';
import {KuberService, KuberModel, DomainModel} from '../../../../../services';
import {CurrentDomainService} from '../current-domain.service';
import {EditKuberModalComponent} from './edit-kuber-modal/edit-kuber-modal.component';

@Component({
    selector: 'kitchen-kuber-node',
    templateUrl: './kuber-node.component.html',
    styleUrls: ['../../../../general-node.scss', 'kuber-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KuberNodeComponent implements OnInit {
    @Input() item: KuberModel;
    @Input() domain: DomainModel;
    @Output() onUpdate: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private _dialogService: MatDialog,
        private _service: KuberService,
        private _currentDomainService: CurrentDomainService,
    ) {
    }

    ngOnInit(): void {
    }

    public edit(): void {
        this._dialogService.open(EditKuberModalComponent, {
            data: {
                item: this.item,
                parent: this.domain,
                group: this._currentDomainService.group,
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
                content: `Are you sure to delete k8s ${this.item.namespace}?`,
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
