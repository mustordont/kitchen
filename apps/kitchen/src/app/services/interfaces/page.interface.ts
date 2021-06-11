export interface IPage<T> {
    page: number;
    pages: number;
    items: T[];
    total?: number;
}
