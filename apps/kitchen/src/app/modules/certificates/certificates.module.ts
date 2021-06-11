import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {RouterModule, Routes} from '@angular/router';
import {TextFieldModule} from '@angular/cdk/text-field';
import {SharedModule} from '../shared/shared.module';
import {CertificatesComponent} from './components';
import { CertificatesAnalyzeComponent } from './components/certificates/certificates-analyze/certificates-analyze/certificates-analyze.component';
import { CertificateComponent } from './components/certificate/certificate.component';
import { CertificateFileComponent } from './components/certificates/certificate-file/certificate-file.component';
import {CertificateFileResolver} from './services/certificate-file-resolver.service';
import { CertificateJobComponent } from './components/certificate/certificate-job/certificate-job.component';
import { EditCertificateJobComponent } from './components/certificate/edit-certificate-job/edit-certificate-job.component';
import { LastCertificateJobComponent } from './components/certificate/last-certificate-job/last-certificate-job.component';

const routes: Routes = [
    {
        path: '',
        component: CertificatesComponent,
    },
    {
        path: ':id',
        component: CertificateFileComponent,
        resolve: {
            item: CertificateFileResolver,
        }
    }
];

@NgModule({
    declarations: [
        CertificatesComponent,
        CertificatesAnalyzeComponent,
        CertificateComponent,
        CertificateFileComponent,
        CertificateJobComponent,
        EditCertificateJobComponent,
        LastCertificateJobComponent,
    ],
    imports: [
        SharedModule,
        TextFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        RouterModule.forChild(routes),
        MatCheckboxModule,
        MatAutocompleteModule,
        MatSelectModule,
    ]
})
export class CertificatesModule {
}
