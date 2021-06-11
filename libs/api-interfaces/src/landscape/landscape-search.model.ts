export interface ILandscapeSearchBaseRequest {
    page: number;
    pageSize: number;
    domain?: number; // domain id
    group?: number; // group id
    kuber?: number;
    network?: number;
    application?: number;
}

export interface ILandscapeSearchKuberRequest extends ILandscapeSearchBaseRequest {
    kuber?: number;
}

export interface ILandscapeSearchHostRequest extends ILandscapeSearchBaseRequest {
    host?: number;
}

export interface ILandscapeSearchBase {
    domain_id: number;
    domain_created: string;
    domain_name: string;

    group_id: number;
    group_created: string;
    group_name: string;

    application_id: number;
    application_name: string;
    application_app_port: number;
    application_created: string;
    application_netscaler_ip: string;
    application_netscaler_url: string;
    application_description: string;
}

export interface ILandscapeSearchKuberResult extends ILandscapeSearchBase {
    kuber_id: number;
    kuber_created: string;
    kuber_namespace: string;
}

export interface ILandscapeSearchHostResult extends ILandscapeSearchBase {
    network_id: number;
    network_created: string;
    network_production: boolean;
    network_base: string;
    network_mask: string;
    network_vlan: number;
    network_vos: number;
    network_description: string;

    host_id: number;
    host_created: string;
    host_auth: string;
    host_citrix: string;
    host_cpu: number;
    host_dnsname: string;
    host_hdd: number;
    host_ip: string;
    host_os: string;
    host_ram: number;
    host_description: string;
}

export interface ILandscapeSearchPage<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
