import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {ILandscapeSearchKuberResult} from '@kitchen/api-interfaces';
import {combineLatest, EMPTY, forkJoin, Observable, of, Subject} from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    startWith,
    switchMap,
    takeUntil,
    tap
} from 'rxjs/operators';
import {ApiClientService} from '../../../../../../services';
import {
    ApplicationService,
    DomainModel,
    DomainService,
    GroupModel,
    GroupService,
    KuberModel,
    KuberService,
    LandscapeSearchKuberResult,
    LandscapeSearchPageModel,
    SearchService
} from '../../../../services';
import {EditKuberModalComponent} from '../../landscape-tree/domain-node/kuber-node/edit-kuber-modal/edit-kuber-modal.component';
import {AbstractLandscapeSearchBaseComponent} from '../abstract-landscape-search-base.component';

@Component({
    selector: 'kitchen-landscape-search-kuber',
    templateUrl: './landscape-search-kuber.component.html',
    styleUrls: ['./landscape-search-kuber.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandscapeSearchKuberComponent extends AbstractLandscapeSearchBaseComponent implements OnInit {
    public displayedColumns: string[] = ['domain', 'group', 'kuber', 'app'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    public pageSizes: number[] = [10, 20, 40];
    public tableData: MatTableDataSource<LandscapeSearchKuberResult> = new MatTableDataSource();

    public form: FormGroup = new FormGroup({
        domain: new FormControl(),
        group: new FormControl(),
        kuber: new FormControl(),
    });

    public searchKubers$: Subject<void> = new Subject<void>();

    public namespaces$: Observable<KuberModel[]> = combineLatest([
        this.searchKubers$
            .pipe(
                startWith(null),
            ),
        this.form.get('kuber').valueChanges
            .pipe(
                startWith(this.form.get('kuber').value),
            ),
    ])
        .pipe(
            debounceTime(500),
            map(([, namespace]: [void, string]) => namespace ? namespace : ''),
            distinctUntilChanged(),
            switchMap((namespace: string) => this._kuberService.search(namespace)
                .pipe(
                    catchError(() => of([])),
                )
            ),
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
        private _kuberService: KuberService,
    ) {
        super(
            _changeDetectorRef,
            _router,
            _route,
            _dialogService,
            _searchService,
            _domainService,
            _groupService,
            _applicationService,
        );
    }

    ngOnInit(): void {
        this._initByQueryParams();

        combineLatest([
            this._refresh$
                .pipe(
                    startWith(null),
                ),
            this.form.valueChanges
                .pipe(
                    filter(() => this.form.valid),
                    distinctUntilChanged(),
                    startWith(this.form.value),
                    tap(() => {
                        this.paginator.firstPage();
                        this._changeDetectorRef.markForCheck();
                    }),
                ),
            this.paginator.page
                .pipe(
                    distinctUntilChanged(),
                    startWith(<PageEvent>{
                        pageIndex: this.paginator.pageIndex,
                        pageSize: this.paginator.pageSize,
                    })
                ),
        ])
            .pipe(
                debounceTime(500),
                map(([, form, page]: [void, any, PageEvent]) => ({
                    domain: form.domain?.id,
                    group: form.group?.id,
                    kuber: form.kuber?.id,
                    page: page.pageIndex,
                    pageSize: page.pageSize,
                })),
                map((filterValues) => ApiClientService.prepareRequest(filterValues)),
                tap((filterValues) => this._router.navigate(
                    ['.'],
                    {
                        relativeTo: this._route,
                        queryParams: ApiClientService.prepareRequest(filterValues)
                    })
                ),
                switchMap((filterValues) => this._searchService.searchAppsByKubers(filterValues)
                    .pipe(
                        catchError(e => EMPTY),
                    )
                ),
                takeUntil(this._onDestroy$),
            )
            .subscribe((page: LandscapeSearchPageModel<ILandscapeSearchKuberResult, LandscapeSearchKuberResult>) => {
                this.tableData.data = page.items;
                this.paginator.length = page.total;
                this._changeDetectorRef.markForCheck();
            });

    }

    public suppressKuber(): void {
        const kuber = this.form.get('kuber').value;
        if (kuber && !kuber.id) {
            this.form.patchValue({
                kuber: null,
            });
        }
    }

    public editKuber(domain_id: number, group_id: number, kuber_id: number) {
        forkJoin([
            this._domainService.get(domain_id),
            this._groupService.get(group_id),
            this._kuberService.get(kuber_id),
        ])
            .pipe(
                switchMap(([domain, group, kuber]: [DomainModel, GroupModel, KuberModel]) => this._dialogService.open(EditKuberModalComponent, {
                        data: {
                            item: kuber,
                            parent: domain,
                            group: group,
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
