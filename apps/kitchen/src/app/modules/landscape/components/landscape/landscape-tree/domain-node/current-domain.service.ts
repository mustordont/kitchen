import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DomainModel, GroupModel} from '../../../../services/models';

@Injectable()
export class CurrentDomainService {
    private _group$: BehaviorSubject<GroupModel> = new BehaviorSubject<GroupModel>(null);
    public group$: Observable<GroupModel> = this._group$.asObservable();

    public get group(): GroupModel {
        return this._group$.value;
    }

    public set group(value: GroupModel) {
        this._group$.next(value);
    }

    private _domain: DomainModel;
    public get domain(): DomainModel {
        return this._domain;
    }

    public set domain(value: DomainModel) {
        this._domain = value;
    }

    constructor() {
    }
}
