import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {ServeStaticModule} from '@nestjs/serve-static';
import {TypeOrmModule} from '@nestjs/typeorm';
import {getMetadataArgsStorage} from 'typeorm';
import { join } from 'path';
import {OracleConnectionOptions} from 'typeorm/driver/oracle/OracleConnectionOptions';

import {environment} from '../environments/environment';
import {migrations} from '../migrations';
import {
    AuthModule,
    ConfigModule,
    LoggerModule,
    LoggerMiddleware,
    LandscapeModule,
    StructureModule,
    ConfigService,
    CertificatesModule,
} from './modules';
import {AboutController, AccountController, ChoiceController, EmployeeController} from './controllers';

const SERVE_STATIC = [];
if (environment.production) {
    SERVE_STATIC.push(
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'kitchen'),
            serveRoot: '',
            exclude: ['api', 'swagger']
        })
    );
}

@Module({
    imports: [
        ConfigModule,
        LoggerModule,
        AuthModule,
        LandscapeModule,
        StructureModule,
        CertificatesModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): OracleConnectionOptions => {
                return {
                    type: configService.DB.type as any,
                    username: configService.DB.username,
                    password: configService.DB.password,
                    host: configService.DB.host,
                    port: configService.DB.port,
                    sid: configService.DB.sid,
                    synchronize: false,
                    logging: configService.DB.logging,
                    migrations,
                    cli: {
                        migrationsDir: 'apps/api/src/migrations'
                    },
                    migrationsRun: true,
                    migrationsTransactionMode: 'all',
                    entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
                };
            },
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        ...SERVE_STATIC,
    ],
    controllers: [
        AboutController,
        AccountController,
        EmployeeController,
        ChoiceController,
    ],
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('/');
    }
}
