export interface IAPIException {
    message: string;
    details: any;
}

export class APIException implements IAPIException {
    public readonly message: string;
    public readonly details: any;

    constructor(data: IAPIException) {
        this.message = data.message;
        this.details = data.details;
    }

    toString(): string {
        if (this.message) {
            return `[Error] ${this.message}`;
        } else {
            return 'Sorry, but we have got an unexpected error';
        }
    }
}
