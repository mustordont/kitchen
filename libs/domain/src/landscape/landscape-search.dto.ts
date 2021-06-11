import {
    ILandscapeSearchBaseRequest,
    ILandscapeSearchPage,
    ILandscapeSearchKuberRequest, ILandscapeSearchHostRequest, ILandscapeSearchKuberResult, ILandscapeSearchHostResult
} from '@kitchen/api-interfaces';
import {ApiProperty} from '@nestjs/swagger';

export class LandscapeSearchRequestBaseDto implements ILandscapeSearchBaseRequest {
    @ApiProperty()
    page: number;
    @ApiProperty()
    pageSize: number;
    @ApiProperty({required: false})
    domain?: number; // domain id
    @ApiProperty({required: false})
    group?: number; // group id
}

export class LandscapeSearchRequestKuberDto extends LandscapeSearchRequestBaseDto implements ILandscapeSearchKuberRequest {
    @ApiProperty({required: false, description: 'kuber id'})
    kuber?: number;
}

export class LandscapeSearchRequestHostDto extends LandscapeSearchRequestBaseDto implements ILandscapeSearchHostRequest {
    @ApiProperty({required: false, description: 'host id'})
    host?: number;
}

export class LandscapeSearchKuberResultDto implements ILandscapeSearchKuberResult {
    @ApiProperty()
    domain_id: number;
    @ApiProperty()
    domain_created: string;
    @ApiProperty()
    domain_name: string;

    @ApiProperty()
    group_id: number;
    @ApiProperty()
    group_created: string;
    @ApiProperty()
    group_name: string;

    @ApiProperty()
    kuber_id: number;
    @ApiProperty()
    kuber_created: string;
    @ApiProperty()
    kuber_namespace: string;

    @ApiProperty()
    application_id: number;
    @ApiProperty()
    application_name: string;
    @ApiProperty()
    application_app_port: number;
    @ApiProperty()
    application_created: string;
    @ApiProperty()
    application_netscaler_ip: string;
    @ApiProperty()
    application_netscaler_url: string;
    @ApiProperty()
    application_description: string;
}

export class LandscapeSearchHostResultDto implements ILandscapeSearchHostResult {
    @ApiProperty()
    domain_id: number;
    @ApiProperty()
    domain_created: string;
    @ApiProperty()
    domain_name: string;

    @ApiProperty()
    group_id: number;
    @ApiProperty()
    group_created: string;
    @ApiProperty()
    group_name: string;

    @ApiProperty()
    network_id: number;
    @ApiProperty()
    network_created: string;
    @ApiProperty()
    network_production: boolean;
    @ApiProperty()
    network_base: string;
    @ApiProperty()
    network_mask: string;
    @ApiProperty()
    network_vlan: number;
    @ApiProperty()
    network_vos: number;
    @ApiProperty()
    network_description: string;

    @ApiProperty()
    host_id: number;
    @ApiProperty()
    host_created: string;
    @ApiProperty()
    host_auth: string;
    @ApiProperty()
    host_citrix: string;
    @ApiProperty()
    host_cpu: number;
    @ApiProperty()
    host_dnsname: string;
    @ApiProperty()
    host_hdd: number;
    @ApiProperty()
    host_ip: string;
    @ApiProperty()
    host_os: string;
    @ApiProperty()
    host_ram: number;
    @ApiProperty()
    host_description: string;

    @ApiProperty()
    application_id: number;
    @ApiProperty()
    application_name: string;
    @ApiProperty()
    application_app_port: number;
    @ApiProperty()
    application_created: string;
    @ApiProperty()
    application_netscaler_ip: string;
    @ApiProperty()
    application_netscaler_url: string;
    @ApiProperty()
    application_description: string;
}

export class LandscapeSearchKuberPageDto implements ILandscapeSearchPage<ILandscapeSearchKuberResult> {
    @ApiProperty()
    page: number;
    @ApiProperty()
    total: number;
    @ApiProperty()
    pageSize: number;
    @ApiProperty({type: () => LandscapeSearchKuberResultDto, isArray: true})
    items: LandscapeSearchKuberResultDto[];
}

export class LandscapeSearchHostPageDto implements ILandscapeSearchPage<ILandscapeSearchHostResult> {
    @ApiProperty()
    page: number;
    @ApiProperty()
    total: number;
    @ApiProperty()
    pageSize: number;
    @ApiProperty({type: () => LandscapeSearchHostResultDto, isArray: true})
    items: LandscapeSearchHostResultDto[];
}
