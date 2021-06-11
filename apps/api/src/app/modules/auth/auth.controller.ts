import {EModules} from '@kitchen/api-interfaces';
import {ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {Body, Controller, Get, HttpStatus, Post, Res, UseGuards} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {getCustomRepository} from 'typeorm';
import {AuthGuard} from '@nestjs/passport';

import {AccountRepository} from './repositories';
import {ConfigService} from '../config';
import {LDAPService} from './ldap';
import {LoggerService} from '../logger';
import {User} from './user.param-decorator';

@ApiTags(EModules.KITCHEN)
@Controller('auth')
export class AuthController {
    constructor(
        private _jwtService: JwtService,
        private _config: ConfigService,
        private _ldapService: LDAPService,
        private _logger: LoggerService,
    ) {
    }

    @Post('login')
    async login(@Body() {username, password}: {username: string, password: string}, @Res() res: Response) {
        this._logger.info(`${username} is logging in`);
        const client = this._ldapService.client;
        try {
            await client.bind(`${this._config.AD.DOMAIN}\\${username}`, password);

            const user = await this._ldapService.getFullAccountInfo(username);
            const userRepository = getCustomRepository(AccountRepository);
            await userRepository.createAndSave(user);

            res.json({
                token: this._jwtService.sign({
                    username: user.username
                }),
            });
        } catch (error) {
            this._logger.error(error);
            res.status(HttpStatus.BAD_REQUEST).json({message: error.toString()});
        } finally {
            await client.unbind();
        }
    }

    @UseGuards(AuthGuard())
    @Get('refresh')
    refresh(@User('username') username: string, @Res() res: Response) {
        this._logger.info(`${username} refreshing his token`);
        res
            .status(HttpStatus.OK)
            .json({
                token: this._jwtService.sign({
                    username
                })
            });
    }
}
