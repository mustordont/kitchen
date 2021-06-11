import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {LoggerService} from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
        private _logger: LoggerService,
    ) {}

    use(req: Request, res: Response, next: Function) {
        this._logger.info(`${req.headers['user-agent']} ${req.url}`);
        next();
    }
}
