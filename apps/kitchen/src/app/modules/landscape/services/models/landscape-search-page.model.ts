import {
    ILandscapeSearchBase, ILandscapeSearchHostResult,
    ILandscapeSearchKuberResult,
    ILandscapeSearchPage,
} from '@kitchen/api-interfaces';
import {ApplicationModel} from './application.model';
import {DomainModel} from './domain.model';
import {GroupModel} from './group.model';
import {HostModel} from './host.model';
import {KuberModel} from './kuber.model';
import {NetworkModel} from './network.model';

export class LandscapeSearchResultBase {
    public readonly domain: DomainModel;
    public readonly group: GroupModel;
    public readonly application: ApplicationModel;
    constructor(data: ILandscapeSearchBase) {
        this.domain = new DomainModel({
            id: data.domain_id,
            name: data.domain_name,
            created: data.domain_created,
            groups: [],
            networks: [],
            kubers: [],
        });

        if (data.group_id) {
            this.group = new GroupModel({
                id: data.group_id,
                name: data.group_name,
                created: data.group_created,
                applications: [],
            });
        }

        if (data.application_id) {
            this.application = new ApplicationModel({
                id: data.application_id,
                created: data.application_created,
                name: data.application_name,
                appPort: data.application_app_port,
                netscalerIP: data.application_netscaler_ip,
                netscalerURL: data.application_netscaler_url,
                description: data.application_description,
            });
        }
    }
}

export class LandscapeSearchKuberResult extends LandscapeSearchResultBase {
    public readonly kuber: KuberModel;
    constructor(data: ILandscapeSearchKuberResult) {
        super(data);
        this.kuber = new KuberModel({
            id: data.kuber_id,
            namespace: data.kuber_namespace,
            created: data.kuber_created,
            applications: [],
        });
    }
}

export class LandscapeSearchHostResult extends LandscapeSearchResultBase {
    public readonly network: NetworkModel;
    public readonly host: HostModel;
    constructor(data: ILandscapeSearchHostResult) {
        super(data);
        if (data.network_id) {
            this.network = new NetworkModel({
                id: data.network_id,
                created: data.network_created,
                base: data.network_base,
                mask: data.network_mask,
                production: data.network_production,
                vlan: data.network_vlan,
                vos: data.network_vos,
                description: data.network_description,
                hosts: [],
            });
        }
        if (data.host_id) {
            this.host = new HostModel({
                id: data.host_id,
                created: data.host_created,
                auth: data.host_auth,
                citrix: data.host_citrix,
                cpu: data.host_cpu,
                dnsname: data.host_dnsname,
                hdd: data.host_hdd,
                ip: data.host_ip,
                os: data.host_os,
                ram: data.host_ram,
                description: data.host_description,
                applications: [],
            });
        }
    }
}

interface ParameterlessConstructor<R, M> {
    new(R): M;
}

export class LandscapeSearchPageModel<T, M> {
    public readonly items: M[] = [];
    public readonly total: number;
    public readonly page: number;
    public readonly pageSize: number;

    constructor(
        private model: ParameterlessConstructor<T, M>,
        data: ILandscapeSearchPage<T>
    ) {
        if (Array.isArray(data.items)) {
            this.items = data.items.map(i => new this.model(i));
        }
        this.total = data.total;
        this.page = data.page;
        this.pageSize = data.pageSize;
    }
}
