import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {StructureService, StructureBlock} from '../structure.service';

interface IFlatBlock {
    expandable: boolean;
    block: StructureBlock;
    level: number;
}

@Component({
    selector: 'y-structure',
    templateUrl: './structure.component.html',
    styleUrls: ['./structure.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StructureComponent {
    private _transformer = (node: StructureBlock, level: number) => {
        return {
            expandable: !!node.member && node.member.length > 0,
            block: node,
            level,
        };
    }

    treeControl = new FlatTreeControl<IFlatBlock>(
        node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.member);

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor(
        private _structureService: StructureService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this._structureService.getStructure()
            .subscribe((data: StructureBlock) => {
                this.dataSource.data = [data];
                this.treeControl.expandAll();
                this._changeDetectorRef.markForCheck();
            });
    }

    hasChild = (_: number, node: IFlatBlock) => node.expandable;
}
