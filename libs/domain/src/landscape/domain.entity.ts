import {IApplication, IDomain, IGroup, IHost, IKuber, INetwork} from '@kitchen/api-interfaces';
import {ApiProperty} from '@nestjs/swagger';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany} from 'typeorm';

import {BaseEntity} from './base.entity';

@Entity({
    name: 'domain'
})
export class DomainEntity extends BaseEntity implements IDomain {
    @ApiProperty()
    @Column({unique: true})
    name: string;

    @ApiProperty({ type: () => NetworkEntity, isArray: true })
    @OneToMany( type => NetworkEntity, network => network.domain, {eager: true, cascade: true})
    @JoinColumn()
    networks: INetwork[];

    @ApiProperty({ type: () => GroupEntity, isArray: true})
    @OneToMany(type => GroupEntity, group => group.domain, {eager: true, cascade: true})
    @JoinColumn()
    groups: IGroup[];

    @ApiProperty({ type: () => KuberEntity, isArray: true})
    @OneToMany(type => KuberEntity, group => group.domain, {eager: true, cascade: true})
    @JoinColumn()
    kubers: IKuber[];
}

@Entity({
    name: 'group',
})
export class GroupEntity extends BaseEntity implements IGroup {
    @ApiProperty()
    @Column({unique: true})
    name: string;

    @ManyToOne( type => DomainEntity, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'domain_id'
    })
    domain: IDomain;

    @ApiProperty({ type: () => ApplicationEntity, isArray: true})
    @OneToMany(type => ApplicationEntity, app => app.group, {eager: true, cascade: true, onDelete: 'CASCADE'})
    applications: IApplication[];
}

@Entity({
    name: 'kuber',
})
export class KuberEntity extends BaseEntity implements IKuber {
    @ApiProperty()
    @Column({unique: true})
    namespace: string;

    @ManyToOne( type => DomainEntity)
    domain: IDomain;

    @ApiProperty({ type: () => ApplicationEntity, isArray: true})
    @ManyToMany(type => ApplicationEntity, app => app.kuber, {eager: true, cascade: true, onDelete: 'CASCADE'})
    @JoinTable({
        name: 'kuber_applications',
        joinColumn: {
            name: 'kuber',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'application',
            referencedColumnName: 'id'
        }
    })
    applications: IApplication[];
}

@Entity({
    name: 'network',
})
export class NetworkEntity extends BaseEntity implements INetwork {
    @ManyToOne(type => DomainEntity)
    @JoinColumn({
        name: 'domain_id'
    })
    domain: IDomain;

    @ApiProperty()
    production: boolean;

    @ApiProperty()
    // 2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d = 39 size
    @Column({unique: true, length: 40})
    base: string;

    @ApiProperty()
    @Column({length: 40})
    mask: string;

    @ApiProperty()
    @Column()
    vos: number;

    @ApiProperty()
    @Column()
    vlan: number;

    @ApiProperty()
    @Column({nullable: true})
    description: string;

    @ApiProperty({ type: () => HostEntity, isArray: true})
    @OneToMany(type => HostEntity, host => host.network, {eager: true, cascade: true, onDelete: 'CASCADE'})
    @JoinColumn()
    hosts: IHost[];
}

@Entity({
    name: 'host',
})
export class HostEntity extends BaseEntity implements IHost {
    @ManyToOne(type => NetworkEntity)
    @JoinColumn({
        name: 'network_id'
    })
    network: INetwork;

    @ApiProperty({ type: () => ApplicationEntity, isArray: true})
    @ManyToMany(type => ApplicationEntity, app => app.host, {eager: true, cascade: true})
    @JoinTable({
        name: 'host_applications',
        joinColumn: {
            name: 'host',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'application',
            referencedColumnName: 'id'
        }
    })
    applications: IApplication[];

    @ApiProperty()
    @Column({length: 40})
    ip: string;

    @ApiProperty()
    @Column()
    dnsname: string;

    @ApiProperty()
    @Column()
    os: string;

    @ApiProperty()
    @Column()
    cpu: number;

    @ApiProperty()
    @Column()
    ram: number;

    @ApiProperty()
    @Column()
    hdd: number;

    @ApiProperty()
    @Column()
    auth: string;

    @ApiProperty()
    @Column()
    citrix: string;

    @ApiProperty()
    @Column({nullable: true})
    description: string;
}

@Entity({
    name: 'application'
})
export class ApplicationEntity extends BaseEntity implements IApplication {
    @ManyToOne(type => GroupEntity)
    @JoinColumn({name: 'group_id'})
    group: IGroup;

    @ManyToMany(type => HostEntity, host => host.applications)
    host: IHost;

    @ManyToMany(type => KuberEntity, kuber => kuber.applications)
    kuber: IKuber;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({name: 'app_port'})
    appPort: number;

    @ApiProperty()
    @Column({name: 'netscaler_ip'})
    netscalerIP: string;

    @ApiProperty()
    @Column({name: 'netscaler_url'})
    netscalerURL: string;

    @ApiProperty()
    @Column({nullable: true})
    description: string;
}
