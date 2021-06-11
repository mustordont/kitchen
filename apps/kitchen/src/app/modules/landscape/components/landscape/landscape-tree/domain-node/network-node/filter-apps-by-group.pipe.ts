import {Pipe, PipeTransform} from '@angular/core';
import {ApplicationModel, GroupModel} from '../../../../../services';

@Pipe({
    name: 'filterAppsByGroup'
})
export class FilterAppsByGroupPipe implements PipeTransform {

    transform(apps: ApplicationModel[], group?: GroupModel): ApplicationModel[] {
        if (!group) {
            return apps;
        } else {
            return apps.filter(i => group.applications.some(j => i.id === j.id));
        }
    }

}
