import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'y-root',
    template: '<router-outlet></router-outlet>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {
    // required for structure without header
}
