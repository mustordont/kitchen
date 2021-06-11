import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AccountGroupModel} from '../../../employee/services';


@Component({
    selector: 'y-user-groups',
    templateUrl: './user-groups.component.html',
    styleUrls: ['./user-groups.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGroupsComponent {
    public ctx: AccountGroupModel[] = [];
    public ad: AccountGroupModel[] = [];

    @Input() set info(value: AccountGroupModel[]) {
        this.ctx = [];
        this.ad = [];
        if (Array.isArray(value)) {
            value.forEach((i) => {
                if (i.ctx) {
                    this.ctx.push(i);
                } else {
                    this.ad.push(i);
                }
            });
        }
    }
}
