import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import {LoggerService} from './logger.service';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    constructor(
        private _logger: LoggerService,
    ) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const error = {
            ...exception,
            stack: exception.stack,
            message: exception.message,
            path: request.url,
        };
        this._logger.error('Error', error);
        response.status(exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
}
