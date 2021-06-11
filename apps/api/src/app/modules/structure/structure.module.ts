import {StructureEntity} from '@kitchen/domain';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth';
import {LoggerModule} from '../logger';
import {StructureController} from './controllers';
import {StructureService} from './services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            StructureEntity,
        ]),
        LoggerModule,
        AuthModule,
    ],
    providers: [
        StructureService,
    ],
    controllers: [
        StructureController,
    ]
})
export class StructureModule {}
