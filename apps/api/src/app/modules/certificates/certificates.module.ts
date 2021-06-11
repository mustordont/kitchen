import {CertEntity, CertFileEntity, CertificateJobEntity} from '@kitchen/domain';
import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth';
import {ConfigModule} from '../config';

import {LoggerModule} from '../logger';
import {
    CertificateFileController,
    CertificatesAnalyzeController,
    CertificateJobController,
    CertificateController,
} from './controllers';
import {CertificateFileService, CertificateJobService, CertificateService} from './services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CertEntity,
            CertFileEntity,
            CertificateJobEntity,
        ]),
        LoggerModule,
        AuthModule,
        HttpModule,
        ConfigModule,
    ],
    providers: [
        CertificateFileService,
        CertificateService,
        CertificateJobService,
    ],
    controllers: [
        CertificatesAnalyzeController,
        CertificateFileController,
        CertificateJobController,
        CertificateController,
    ],
})
export class CertificatesModule {}
