import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {RouterModule} from '@angular/router';

import {EmployeeService} from './services';
import {SharedModule} from '../shared/shared.module';
import {EmployeeListComponent, AccountInfoComponent} from './components';

const ROUTES = [
    {
        path: '',
        component: EmployeeListComponent,
        data: {
            title: 'Employee',
        },
    },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(ROUTES),
        MatAutocompleteModule,
    ],
    declarations: [
        EmployeeListComponent,
        AccountInfoComponent,
    ],
    providers: [
        EmployeeService,
    ],
    exports: [
        RouterModule,
    ]
})
export class EmployeeModule {
}
