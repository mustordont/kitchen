import {ApplicationEntity, DomainEntity, GroupEntity, HostEntity, KuberEntity, NetworkEntity} from '@kitchen/domain';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth';
import {LoggerModule} from '../logger';

import {
    DomainController,
    NetworkController,
    GroupController,
    HostController,
    KuberController,
    ApplicationController,
    LandscapeSearchController
} from './controllers';
import {
    ApplicationService,
    DomainService,
    GroupService,
    HostService,
    KuberService,
    NetworkService,
    SearchService
} from './services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DomainEntity,
            GroupEntity,
            KuberEntity,
            NetworkEntity,
            HostEntity,
            ApplicationEntity,
        ]),
        LoggerModule,
        AuthModule,
    ],
    providers: [
        DomainService,
        GroupService,
        KuberService,
        NetworkService,
        HostService,
        ApplicationService,
        SearchService,
    ],
    controllers: [
        DomainController,
        GroupController,
        KuberController,
        NetworkController,
        HostController,
        ApplicationController,
        LandscapeSearchController,
    ],
})
export class LandscapeModule {}
