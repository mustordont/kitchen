import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IBaseDomain} from '@kitchen/api-interfaces';
import {ApiClientService} from '../../services';

// create constructor function type alias
type Ctor<U> = new ( ...args: any[] ) => U;

// factory function
export function simpleFactory<T>(
    ctor: Ctor<T>,
    ...args: any[]
): T {
    return new ctor( ...args );
}

export abstract class CrudService<T, I extends IBaseDomain> {
    protected abstract _prefixUrl: string;

    protected abstract _factory: (data: I) => T;

    constructor(
        protected _apiClient: ApiClientService,
    ) {
    }

    public getAll(): Observable<T[]> {
        return this._apiClient.request('get', this._prefixUrl)
            .pipe(
                map((result: I[]) => result.map(i => this._factory(i))),
            );
    }

    public get(id: number): Observable<T> {
        return this._apiClient.request('get', this._prefixUrl + '/' + id)
            .pipe(
                map((result: I) => this._factory(result)),
            );
    }

    public create(data: I, parentId?: number): Observable<T> {
        return this._apiClient.request('post', this._prefixUrl, data)
            .pipe(
                map((result: I) => this._factory(result)),
            );
    }

    public update(data: I): Observable<T> {
        return this._apiClient.request('put', this._prefixUrl  + '/' + data.id, data)
            .pipe(
                map((result: I) => this._factory(result)),
            );
    }

    public delete(id: number): Observable<void> {
        return this._apiClient.request('delete', this._prefixUrl + '/' + id);
    }

}
