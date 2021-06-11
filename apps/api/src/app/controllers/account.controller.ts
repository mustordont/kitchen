import {EModules} from '@kitchen/api-interfaces';
import {KitchenAccountEntity} from '@kitchen/domain';
import {ApiBearerAuth, ApiHeader, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {getCustomRepository} from 'typeorm';
import {Controller, Get, HttpException, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {AccountRepository, User, LoggerService} from '../modules';

@ApiBearerAuth()
@ApiTags(EModules.KITCHEN)
@UseGuards(AuthGuard())
@Controller('account')
export class AccountController {

    constructor(
        private _logger: LoggerService,
    ) {
    }

    @ApiHeader({
        name: 'authorization',
        description: 'authorization header',
    })
    @ApiResponse({ status: 200, type: KitchenAccountEntity })
    @ApiResponse({ status: 500, type: HttpException})
    @Get()
    async getAccountInfo(@User('username') username: string, @Res() res: Response) {
        this._logger.info(`${username} getting his account info`);
        try {
            const userRepository = getCustomRepository(AccountRepository);
            const user: KitchenAccountEntity = await userRepository.findByLogin(username);
            if (!user) {
                const error = `User ${username} not found`;
                this._logger.error(error);
                throw error;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({message: error.toString()});
        }
    }
}
