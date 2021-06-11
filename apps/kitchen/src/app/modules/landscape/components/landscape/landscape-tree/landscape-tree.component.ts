import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subject} from 'rxjs';
import {filter, startWith, switchMap} from 'rxjs/operators';
import {DomainService} from '../../../services';
import {DomainModel} from '../../../services/models';
import {EditDomainModalComponent} from './domain-node/edit-domain-modal/edit-domain-modal.component';

@Component({
    selector: 'kitchen-landscape-tree',
    templateUrl: './landscape-tree.component.html',
    styleUrls: ['./landscape-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandscapeTreeComponent implements OnInit {
    public refresh$: Subject<void> = new Subject();

    public domains$: Observable<DomainModel[]> = this.refresh$
        .pipe(
            startWith(null),
            switchMap(() => this._domainService.getAll())
        );

    constructor(
        private _dialogService: MatDialog,
        private _domainService: DomainService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
    }

    public newDomain() {
        this._dialogService.open(EditDomainModalComponent)
            .afterClosed()
            .pipe(
                filter(Boolean),
            )
            .subscribe(() => this.refresh$.next());
    }

}
