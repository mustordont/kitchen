import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {ILandscapeSearchHostResult,} from '@kitchen/api-interfaces';
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
import {EditNetworkModalComponent} from '../../..';
import {ApiClientService} from '../../../../../../services';
import {
    ApplicationService,
    DomainModel,
    DomainService,
    GroupService,
    HostModel,
    HostService,
    LandscapeSearchHostResult,
    LandscapeSearchPageModel,
    NetworkModel,
    NetworkService,
    SearchService
} from '../../../../services';
import {EditHostModalComponent} from '../../landscape-tree/domain-node/network-node/host-node/edit-host-modal/edit-host-modal.component';
import {AbstractLandscapeSearchBaseComponent} from '../abstract-landscape-search-base.component';

@Component({
    selector: 'kitchen-landscape-search-host',
    templateUrl: './landscape-search-host.component.html',
    styleUrls: ['./landscape-search-host.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandscapeSearchHostComponent extends AbstractLandscapeSearchBaseComponent implements OnInit {
    public displayedColumns: string[] = ['domain', 'group', 'network', 'host', 'app'];
    public tableData: MatTableDataSource<LandscapeSearchHostResult> = new MatTableDataSource();

    public form: FormGroup = new FormGroup({
        domain: new FormControl(),
        group: new FormControl(),
        host: new FormControl(''),
    });

    public searchHosts$: Subject<void> = new Subject<void>();

    public hosts$: Observable<HostModel[]> = combineLatest([
        this.searchHosts$
            .pipe(
                startWith(null),
            ),
        this.form.get('host').valueChanges
            .pipe(
                startWith(this.form.get('host').value),
            ),
    ])
        .pipe(
            debounceTime(500),
            map(([, dnsname]: [void, string]) => dnsname ? dnsname : ''),
            distinctUntilChanged(),
            switchMap((dnsname: string) => this._hostService.search(dnsname)
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
        private _networkService: NetworkService,
        private _hostService: HostService,
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
                    host: form.host?.id,
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
                switchMap((filterValues) => this._searchService.searchAppsByHosts(filterValues)
                    .pipe(
                        catchError(e => EMPTY),
                    )
                ),
                takeUntil(this._onDestroy$),
            )
            .subscribe((page: LandscapeSearchPageModel<ILandscapeSearchHostResult, LandscapeSearchHostResult>) => {
                this.tableData.data = page.items;
                this.paginator.length = page.total;
                this._changeDetectorRef.markForCheck();
            });
    }

    public suppressHost(): void {
        const host = this.form.get('host').value;
        if (host && !host.id) {
            this.form.patchValue({
                host: null,
            });
        }
    }

    public editNetwork(domain_id: number, network_id: number) {
        forkJoin([
            this._domainService.get(domain_id),
            this._networkService.get(network_id),
        ])
            .pipe(
                switchMap(([domain, network]: [DomainModel, NetworkModel]) =>
                    this._dialogService.open(EditNetworkModalComponent, {
                        data: {
                            item: network,
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

    public editHost(domain_id: number, network_id: number, host_id: number) {
        forkJoin([
            this._domainService.get(domain_id),
            this._networkService.get(network_id),
            this._hostService.get(host_id),
        ])
            .pipe(
                switchMap(([domain, network, host]: [DomainModel, NetworkModel, HostModel]) =>
                    this._dialogService.open(EditHostModalComponent, {
                        data: {
                            item: host,
                            parent: network,
                            domain,
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
