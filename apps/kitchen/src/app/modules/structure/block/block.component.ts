import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {StructureBlock} from '../structure.service';

@Component({
    selector: 'y-block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockComponent {
    @Input() block: StructureBlock;
}
