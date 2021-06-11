import {Module} from '@nestjs/common';
import {WinstonModule} from 'nest-winston';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
const { combine, timestamp, json } = winston.format;

import {LoggerService} from './logger.service';
import {ConfigModule, ConfigService} from '../config';
import {LoggerMiddleware} from './logger.middleware';
import {ExceptionsFilter} from './exceptions.filter';
import {APP_FILTER} from '@nestjs/core';

@Module({
    imports: [
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const transports: Transport[] = [new winston.transports.Console()];

                if (configService.LOGS_FOLDER) {
                    transports.push(
                        new winston.transports.File({
                            dirname: configService.LOGS_FOLDER,
                            level: 'info',
                            format: filterOnly('info'),
                            filename: 'info.log'
                        }),
                        new winston.transports.File({
                            dirname: configService.LOGS_FOLDER,
                            level: 'error',
                            format: filterOnly('error'),
                            filename: 'error.log'
                        }),
                    );
                }

                return {
                    format: combine(
                        timestamp(),
                        json()
                    ),
                    transports,
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [
        LoggerService,
        LoggerMiddleware,
        {
            provide: APP_FILTER,
            useClass: ExceptionsFilter,
        },
    ],
    exports: [LoggerService],
})
export class LoggerModule {
}

/**
 * Log only the messages the match `level`.
 */
function filterOnly(level) {
    return winston.format(function (info) {
        if (info['level'] === level) {
            return info;
        }
    })();
}
