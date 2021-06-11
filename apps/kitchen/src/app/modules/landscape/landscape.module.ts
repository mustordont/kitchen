import {TextFieldModule} from '@angular/cdk/text-field';
import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {EditDomainModalComponent, EditNetworkModalComponent, LandscapeComponent} from './components';
import {LandscapeSearchCellHostComponent} from './components/landscape/landscape-search/landscape-search-cell-host/landscape-search-cell-host.component';
import {LandscapeSearchCellNetworkComponent} from './components/landscape/landscape-search/landscape-search-cell-network/landscape-search-cell-network.component';
import {LandscapeSearchHostComponent} from './components/landscape/landscape-search/landscape-search-host/landscape-search-host.component';
import {LandscapeSearchComponent} from './components/landscape/landscape-search/landscape-search.component';
import { DomainNodeComponent } from './components/landscape/landscape-tree/domain-node/domain-node.component';
import {EditApplicationModalComponent} from './components/landscape/landscape-tree/domain-node/edit-application-modal/edit-application-modal.component';
import {EditGroupModalComponent} from './components/landscape/landscape-tree/domain-node/edit-group-modal/edit-group-modal.component';
import {FilterAppsByGroupPipe} from './components/landscape/landscape-tree/domain-node/network-node/filter-apps-by-group.pipe';
import {EditHostModalComponent} from './components/landscape/landscape-tree/domain-node/network-node/host-node/edit-host-modal/edit-host-modal.component';
import { NetworkNodeComponent } from './components/landscape/landscape-tree/domain-node/network-node/network-node.component';
import { HostNodeComponent } from './components/landscape/landscape-tree/domain-node/network-node/host-node/host-node.component';
import { FilterByAppsPipe } from './components/landscape/landscape-tree/domain-node/network-node/filter-by-apps.pipe';
import {EditKuberModalComponent} from './components/landscape/landscape-tree/domain-node/kuber-node/edit-kuber-modal/edit-kuber-modal.component';
import { KuberNodeComponent } from './components/landscape/landscape-tree/domain-node/kuber-node/kuber-node.component';
import { LandscapeTreeComponent } from './components/landscape/landscape-tree/landscape-tree.component';
import { LandscapeSearchKuberComponent } from './components/landscape/landscape-search/landscape-search-kuber/landscape-search-kuber.component';
import { LandscapeSearchCellAppComponent } from './components/landscape/landscape-search/landscape-search-cell-app/landscape-search-cell-app.component';

const ROUTES: Routes = [
    {
        path: '',
        component: LandscapeComponent,
        children: [
            {
                path: 'tree',
                component: LandscapeTreeComponent,
            },
            {
                path: 'search',
                component: LandscapeSearchComponent,
                children: [
                    {
                        path: 'kuber',
                        component: LandscapeSearchKuberComponent,
                    },
                    {
                        path: 'host',
                        component: LandscapeSearchHostComponent,
                    },
                    {
                        path: '**',
                        redirectTo: 'kuber',
                    }
                ],
            },
            {
                path: '**',
                redirectTo: 'tree',
            }
        ]
    },
];

@NgModule({
    declarations: [
        EditDomainModalComponent,
        EditGroupModalComponent,
        EditApplicationModalComponent,
        EditNetworkModalComponent,
        LandscapeComponent,
        DomainNodeComponent,
        NetworkNodeComponent,
        HostNodeComponent,
        EditHostModalComponent,
        FilterByAppsPipe,
        FilterAppsByGroupPipe,
        KuberNodeComponent,
        EditKuberModalComponent,
        LandscapeTreeComponent,
        LandscapeSearchComponent,
        LandscapeSearchKuberComponent,
        LandscapeSearchHostComponent,
        LandscapeSearchCellAppComponent,
        LandscapeSearchCellNetworkComponent,
        LandscapeSearchCellHostComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(ROUTES),
        MatCheckboxModule,
        TextFieldModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatAutocompleteModule,
    ]
})
export class LandscapeModule {
}
