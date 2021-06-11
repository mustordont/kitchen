import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HostModel} from '../../../../services';

@Component({
    selector: 'kitchen-landscape-search-cell-host',
    templateUrl: './landscape-search-cell-host.component.html',
    styleUrls: [
        './landscape-search-cell-host.component.scss',
        '../landscape-search-cell-app/landscape-search-cell-app.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandscapeSearchCellHostComponent {

    @Input() host: HostModel;

}
