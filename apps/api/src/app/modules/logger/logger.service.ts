import {Inject, Injectable} from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements LoggerService {
    constructor(
        @Inject('winston') private readonly logger: winston.Logger,
    ) {}

    info(message: string, context?: any): void {
        // super.log(message, JSON.stringify(context));
        this.logger.info(message, { context });
    }

    debug(message: string, context?: any): void {
        // super.debug(message, JSON.stringify(context));
        this.logger.debug(message, { context });
    }

    error(message: string, context?: any): void {
        // super.error(message, trace, JSON.stringify(context));
        this.logger.error(message, { context });
    }
}
