import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {KitchenComponent, LoginComponent, SettingsComponent} from './components';
import {AuthGuardService} from './services';
import {AccountInfoComponent} from './modules/employee/components';

export const routingConfiguration: ExtraOptions = {
    paramsInheritanceStrategy: 'always',
    // enableTracing: true,
    initialNavigation: 'enabled',
    relativeLinkResolution: 'legacy'
};

const routes: Routes = [
    {
        path: 'structure',
        loadChildren: () => import('./modules/structure/structure.module').then(mod => mod.StructureModule),
    },
    {
        path: '',
        component: KitchenComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: '',
                children: [
                    {
                        path: 'account',
                        component: AccountInfoComponent,
                        data: {
                            title: 'Account Info',
                        },
                    },
                    {
                        path: 'employee',
                        loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule),
                    },
                    {
                        path: 'certificates',
                        loadChildren: () => import('./modules/certificates/certificates.module').then(m => m.CertificatesModule),
                    },
                    {
                        path: 'landscape',
                        loadChildren: () => import('./modules/landscape/landscape.module').then(m => m.LandscapeModule),
                    },
                    {
                        path: 'settings',
                        component: SettingsComponent,
                        data: {
                            title: 'Settings',
                        }
                    },
                ],
                canActivate: [AuthGuardService],
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            routingConfiguration,
        ),
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRoutingModule {
}
