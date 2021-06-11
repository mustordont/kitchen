import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NetworkModel} from '../../../../services';

@Component({
    selector: 'kitchen-landscape-search-cell-network',
    templateUrl: './landscape-search-cell-network.component.html',
    styleUrls: [
        './landscape-search-cell-network.component.scss',
        '../landscape-search-cell-app/landscape-search-cell-app.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandscapeSearchCellNetworkComponent {

    @Input() network: NetworkModel;

}
