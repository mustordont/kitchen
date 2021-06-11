import {Injectable} from '@angular/core';
import {ECertificateJobStatus, ICertificate, ICertificateFile, ICertificateJob} from '@kitchen/api-interfaces';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService, AuthService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared';
import {CertificateFileModel, CertificateJobModel, CertificateModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class CertificateFileService extends CrudService<CertificateFileModel, ICertificateFile> {
    protected _prefixUrl = AppSettings.CONFIG.api.certificates.file;
    protected _factory = (data: ICertificateFile) => simpleFactory(CertificateFileModel, data);

    constructor(
        private _authService: AuthService,
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }

    public analyze(formData: FormData): Observable<CertificateModel[]> {
        return this._apiClient.request('post', AppSettings.CONFIG.api.certificates.analyze, formData)
            .pipe(
                map((data: ICertificate[]) => data
                    // add very first job
                    .map(i => ({
                        ...i,
                        jobs: [this.newJob()]
                    }))
                    .map(i => new CertificateModel(i))
                ),
            );
    }

    public newJob(): ICertificateJob {
        return new CertificateJobModel({
            emails: this._authService.accountInfo$.value.mail,
            status: ECertificateJobStatus.PENDING,
        })
            .serialize();
    }
}
