export interface IAccountGroup {
    id?: number;
    name: string;
    ctx: boolean;
}

export class AccountGroup implements IAccountGroup {
    public readonly id?: number;
    public readonly name: string;
    public readonly ctx: boolean;

    constructor(data?: IAccountGroup) {
        // DB Entity will be called without args
        if (!data) {
            return;
        }
        this.name = data.name;
        this.ctx = data.ctx;
    }
}
