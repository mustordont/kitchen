import {IPage} from '../interfaces/page.interface';

interface ParameterlessConstructor<R, M> {
    new(R): M;
}

export class PagingModel<R, M> {
    public page: number = 0;
    public pages: number = 0;
    public total: number = 0;
    public items: M[] = [];

    constructor(
        private model: ParameterlessConstructor<R, M>,
        data?: IPage<R>,
    ) {
        if (data) {
            this.page = data.page - 1;
            this.pages = data.pages - 1;
            this.total = data.total;
            this.items = data.items.map(i => new this.model(i));
        }
    }
}
