import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'y-drag-handler',
    templateUrl: './drag-handler.component.html',
    styleUrls: ['drag-handler.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragHandlerComponent {}
