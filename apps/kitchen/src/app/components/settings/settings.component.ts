import {ChangeDetectionStrategy, Component} from '@angular/core';
import {KitchenService} from '../../services/kitchen.service';
import {NotificationService} from '../../services';

@Component({
    selector: 'y-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
    constructor(
        private _kitchenService: KitchenService,
        private _notificationService: NotificationService,
    ) {
    }

    public generateStructure(): void {
        this._kitchenService.generateStructure()
            .subscribe(() => {
                this._notificationService.showSnack('Success', false);
            });
    }

}
