import {ChangeDetectionStrategy, Component} from '@angular/core';
import {KitchenService} from '../../services';

@Component({
    selector: 'y-about',
    templateUrl: './about.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
    constructor(
        public kitchenService: KitchenService,
    ) {
    }
}
