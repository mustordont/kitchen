import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import {StructureComponent} from './structure/structure.component';
import {SharedModule} from '../shared/shared.module';
import {StructureService} from './structure.service';
import {BlockComponent} from './block/block.component';

const ROUTES: Routes = [
    {
        path: '',
        component: StructureComponent,
    }
];

@NgModule({
    declarations: [
        StructureComponent,
        BlockComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(ROUTES),
        MatTreeModule,
        MatChipsModule,
    ],
    providers: [
        StructureService,
    ]
})
export class StructureModule {
}
