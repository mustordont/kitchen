import {ChangeDetectorRef, Directive, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {combineLatest, forkJoin, Observable, Subject} from 'rxjs';
import {filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {EditDomainModalComponent} from '../..';
import {BaseComponent} from '../../../../../components';
import {
    ApplicationModel,
    ApplicationService,
    DomainModel,
    DomainService,
    GroupModel,
    GroupService,
    SearchService,
} from '../../../services';
import {EditApplicationModalComponent} from '../landscape-tree/domain-node/edit-application-modal/edit-application-modal.component';
import {EditGroupModalComponent} from '../landscape-tree/domain-node/edit-group-modal/edit-group-modal.component';

@Directive()
export abstract class AbstractLandscapeSearchBaseComponent extends BaseComponent {
    protected _queryParamMap: ParamMap = this._route.snapshot.queryParamMap;

    public displayedColumns: string[] = ['domain', 'group', 'kuber', 'app', 'network', 'host'];
    @ViewChild(MatPaginator, {static: true}) public paginator: MatPaginator;
    public pageSizes: number[] = [10, 20, 40];
    public tableData: MatTableDataSource<any> = new MatTableDataSource();

    protected _refresh$: Subject<void> = new Subject();
    public form: FormGroup = new FormGroup({
        domain: new FormControl(),
        group: new FormControl(),
    });

    public domains$: Observable<DomainModel[]> = this._domainService.getAll();
    public groups$: Observable<GroupModel[]> = combineLatest([
        this.domains$,
        this.form.get('domain').valueChanges
            .pipe(
                startWith(this.domain),
            ),
    ])
        .pipe(
            map(([domains, domain]: [DomainModel[], DomainModel]) => {
                if (domain) {
                    return domain.groups;
                } else {
                    return domains.reduce((acc: GroupModel[], cur: DomainModel) => acc.concat(cur.groups), []);
                }
            }),
        );

    constructor(
        protected _changeDetectorRef: ChangeDetectorRef,
        protected _router: Router,
        protected _route: ActivatedRoute,
        protected _dialogService: MatDialog,
        protected _searchService: SearchService,
        protected _domainService: DomainService,
        protected _groupService: GroupService,
        protected _applicationService: ApplicationService,
    ) {
        super();
    }

    protected _initByQueryParams(): void {
        this.paginator.pageSize = Number(this._queryParamMap.get('pageSize')) || this.pageSizes[0];
        this.paginator.pageIndex = Number(this._queryParamMap.get('page'));
    }

    public get domain(): DomainModel {
        return this.form.get('domain').value;
    }

    public editDomain(domain_id: number) {
        this._domainService.get(domain_id)
            .pipe(
                switchMap((domain) => this._dialogService.open(EditDomainModalComponent, {
                        data: {
                            item: domain,
                        },
                    })
                        .afterClosed()
                        .pipe(
                            filter(Boolean),
                            tap(() => this._refresh$.next()),
                        )
                )
            )
            .subscribe()
    }

    public editGroup(domain_id: number, group_id: number) {
        forkJoin([
            this._domainService.get(domain_id),
            this._groupService.get(group_id),
        ])
            .pipe(
                switchMap(([domain, group]: [DomainModel, GroupModel]) => this._dialogService.open(EditGroupModalComponent, {
                        data: {
                            item: group,
                            parent: domain,
                        },
                    })
                        .afterClosed()
                        .pipe(
                            filter(Boolean),
                            tap(() => this._refresh$.next()),
                        )
                )
            )
            .subscribe()
    }

    public editApplication(domain_id: number, group_id: number, application_id: number) {
        forkJoin([
            this._domainService.get(domain_id),
            this._groupService.get(group_id),
            this._applicationService.get(application_id),
        ])
            .pipe(
                switchMap(([domain, group, item]: [DomainModel, GroupModel, ApplicationModel]) => this._dialogService.open(EditApplicationModalComponent, {
                        data: {
                            item,
                            domain,
                            group,
                        },
                    })
                        .afterClosed()
                        .pipe(
                            filter(Boolean),
                            tap(() => this._refresh$.next()),
                        )
                )
            )
            .subscribe()
    }
}
