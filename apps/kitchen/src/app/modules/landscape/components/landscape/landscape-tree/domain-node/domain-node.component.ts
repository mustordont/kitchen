import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {filter, finalize, switchMap, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../../../../components';
import {ConfirmModalComponent} from '../../../../../shared/components/confirm-modal/confirm-modal.component';
import {
    ApplicationModel,
    ApplicationService,
    DomainModel,
    DomainService,
    GroupModel,
    GroupService
} from '../../../../services';
import {compareBaseModels} from '../../../helpers';
import {EditKuberModalComponent} from './kuber-node/edit-kuber-modal/edit-kuber-modal.component';
import {CurrentDomainService} from './current-domain.service';
import {EditApplicationModalComponent} from './edit-application-modal/edit-application-modal.component';
import {EditDomainModalComponent} from './edit-domain-modal/edit-domain-modal.component';
import {EditGroupModalComponent} from './edit-group-modal/edit-group-modal.component';
import {EditNetworkModalComponent} from './network-node/edit-network-modal/edit-network-modal.component';

@Component({
    selector: 'kitchen-domain-node',
    templateUrl: './domain-node.component.html',
    styleUrls: ['../../../general-node.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'mat-elevation-z4'
    },
    providers: [CurrentDomainService]
})
export class DomainNodeComponent extends  BaseComponent implements OnInit {
    public busy$: Subject<boolean> = new Subject();
    public refresh$: Subject<void> = new Subject<void>();

    @Input() item: DomainModel;
    @Output() onUpdate: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private _dialogService: MatDialog,
        private _service: DomainService,
        private _groupService: GroupService,
        private _applicationService: ApplicationService,
        private _changeDetectorRef: ChangeDetectorRef,
        public currentDomainService: CurrentDomainService,
    ) {
        super();
    }

    public isExpanded: boolean = true;

    public edit(): void {
        this._dialogService.open(EditDomainModalComponent, {
            data: {
                item: this.item
            },
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.refresh$.next()),
            )
            .subscribe();
    }

    public delete(): void {
        this._dialogService.open(ConfirmModalComponent, {
            data: {
                title: 'Delete',
                content: `Are you sure to delete domain ${this.item.name}?`,
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
                this.onUpdate.emit();
            });
    }

    ngOnInit(): void {
        this.currentDomainService.domain = this.item;

        this.refresh$
            .pipe(
                switchMap(() => {
                    this.busy$.next(true);
                    return this._service.get(this.item.id)
                        .pipe(
                            tap((domain: DomainModel) => {
                                this.item = domain;
                                this.currentDomainService.domain = this.item;
                                if (this.currentDomainService.group) {
                                    this.currentDomainService.group = this.item.groups.find(i => i.id === this.currentDomainService.group.id);
                                }
                            }),
                            finalize(() => this.busy$.next(false)),
                        )
                }),
                takeUntil(this._onDestroy$),
            )
            .subscribe();
    }

    public newNetwork(): void {
        this._dialogService.open(EditNetworkModalComponent, {
            data: {
                parent: this.item
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.refresh$.next()),
            )
            .subscribe();
    }

    public newGroup() {
        this._dialogService.open(EditGroupModalComponent, {
            data: {
                parent: this.item
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.refresh$.next()),
            )
            .subscribe();
    }

    public newApplication() {
        this._dialogService.open(EditApplicationModalComponent, {
            data: {
                domain: this.item,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.refresh$.next()),
            )
            .subscribe();
    }

    public newKuber() {
        this._dialogService.open(EditKuberModalComponent, {
            data: {
                parent: this.item,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.refresh$.next()),
            )
            .subscribe();
    }

    public compareIds = compareBaseModels;

    public editGroup(group: GroupModel) {
        this._dialogService.open(EditGroupModalComponent, {
            data: {
                parent: this.item,
                item: group,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.refresh$.next()),
            )
            .subscribe();
    }

    public deleteGroup(group: GroupModel) {
        this._dialogService.open(ConfirmModalComponent, {
            data: {
                title: 'Delete',
                content: `Are you sure to delete group ${group.name}?`,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                switchMap(() => {
                    return this._groupService.delete(group.id);
                })
            )
            .subscribe(() => {
                this.onUpdate.emit();
            });
    }

    public editApp(item: ApplicationModel) {
        this._dialogService.open(EditApplicationModalComponent, {
            data: {
                domain: this.item,
                group: this.currentDomainService.group,
                item,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                tap(() => this.refresh$.next()),
            )
            .subscribe();
    }

    public deleteApp(app: ApplicationModel) {
        this._dialogService.open(ConfirmModalComponent, {
            data: {
                title: 'Delete',
                content: `Are you sure to delete application ${app.name}?`,
            }
        })
            .afterClosed()
            .pipe(
                filter(Boolean),
                switchMap(() => {
                    return this._applicationService.delete(app.id);
                })
            )
            .subscribe(() => {
                this.onUpdate.emit();
            });
    }
}
