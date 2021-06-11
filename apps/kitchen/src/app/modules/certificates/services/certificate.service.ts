import {Injectable} from '@angular/core';
import {ICertificate} from '@kitchen/api-interfaces';
import {AppSettings} from '../../../app-settings.service';
import {ApiClientService} from '../../../services';
import {CrudService, simpleFactory} from '../../shared';
import {CertificateModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class CertificateService extends CrudService<CertificateModel, ICertificate> {
    protected _prefixUrl = AppSettings.CONFIG.api.certificates.root;
    protected _factory = (data: ICertificate) => simpleFactory(CertificateModel, data);

    constructor(
        protected _apiClient: ApiClientService,
    ) {
        super(_apiClient);
    }
}
