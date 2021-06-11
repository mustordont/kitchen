import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'kitchen-landscape',
    templateUrl: './landscape.component.html',
    styleUrls: ['./landscape.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandscapeComponent {
}
