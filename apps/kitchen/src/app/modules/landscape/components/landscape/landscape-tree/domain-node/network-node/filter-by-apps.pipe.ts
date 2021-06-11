import {Pipe, PipeTransform} from '@angular/core';
import {GroupModel, HostModel, KuberModel} from '../../../../../services/models';

type TypeWithApps = HostModel|KuberModel;

@Pipe({
    name: 'filterByApps'
})
export class FilterByAppsPipe implements PipeTransform {

    transform(hosts: TypeWithApps[], group?: GroupModel): TypeWithApps[] {
        if (!group) {
            return hosts;
        } else {
            return hosts.filter(i => !i.applications.length
                || i.applications.some(j => group.applications.some(k => k .id === j.id)
                ));
        }
    }

}
