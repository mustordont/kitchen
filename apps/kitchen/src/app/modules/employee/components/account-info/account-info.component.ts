import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../../../../services';

@Component({
    selector: 'y-user-profile',
    templateUrl: './account-info.component.html',
    styleUrls: [
        '../../../shared/components/user-groups/user-groups.component.scss',
        './account-info.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInfoComponent {
    constructor(
        public authService: AuthService,
    ) {
    }
}
