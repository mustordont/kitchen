import {AccountBase} from '@kitchen/api-interfaces';

export class AccountModel extends AccountBase {
    get personName(): string {
        return this.fullName ? `${this.name} - ${this.fullName}` : this.name;
    }

    get photo(): string {
        return this.thumbnailPhoto ? `data:image/png;base64, ${this.thumbnailPhoto}` : null;
    }

    get vkProfileLink(): string {
        return `https://vk.com/id${this.vkID}`;
    }
}
