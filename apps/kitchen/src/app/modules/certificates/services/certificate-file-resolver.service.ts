import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CertificateFileService} from './certificate-file.service';
import {CertificateFileModel} from './models';

@Injectable({
    providedIn: 'root'
})
export class CertificateFileResolver implements Resolve<CertificateFileModel> {
    constructor(
        private _service: CertificateFileService,
    ) {
    }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<CertificateFileModel> {
        return this._service.get(+route.paramMap.get('id'));
    }
}
