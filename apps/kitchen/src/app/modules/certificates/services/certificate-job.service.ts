import {Injectable} from '@angular/core';
import {ICertificateJob} from '@kitchen/api-interfaces';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared';
import {CertificateJobModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class CertificateJobService extends CrudService<CertificateJobModel, ICertificateJob> {
    protected _prefixUrl = AppSettings.CONFIG.api.certificates.job;
    protected _factory = (data: ICertificateJob) => simpleFactory(CertificateJobModel, data);

    constructor(
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }
}
