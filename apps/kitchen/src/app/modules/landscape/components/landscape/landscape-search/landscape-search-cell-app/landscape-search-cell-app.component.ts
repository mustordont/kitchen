import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ApplicationModel} from '../../../../services';

@Component({
    selector: 'kitchen-landscape-search-cell-app',
    templateUrl: './landscape-search-cell-app.component.html',
    styleUrls: ['./landscape-search-cell-app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandscapeSearchCellAppComponent {

    @Input() app: ApplicationModel;

}
