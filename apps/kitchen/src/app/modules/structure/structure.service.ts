import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IStructureBlock} from '@kitchen/api-interfaces';
import {AppSettings} from '../../app-settings.service';
import {AccountModel} from '../../services';

export class StructureBlock {
    department?: string;
    displayName: string;
    manager: AccountModel;
    spaceURL?: string;
    member?: StructureBlock[];
}

@Injectable()
export class StructureService {

    constructor(
        private _httpClient: HttpClient,
    ) {
    }

    public getStructure(): Observable<StructureBlock> {
        return this._httpClient.get(AppSettings.CONFIG.baseURL + AppSettings.CONFIG.api.structure.get)
            .pipe(
                map((result: IStructureBlock) => this._parseStructureBlock(result)),
            );
    }

    private _parseStructureBlock(data: IStructureBlock): StructureBlock {
        const member = data.member.map(i => this._parseStructureBlock(i));
        return {
            displayName: data.displayName,
            department: data.department,
            manager: data.manager ? new AccountModel(data.manager) : null,
            spaceURL: data.spaceURL ? data.spaceURL : null,
            member,
        };
    }
}
