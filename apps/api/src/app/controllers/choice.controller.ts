import {EModules} from '@kitchen/api-interfaces';
import {ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {Body, Controller, HttpStatus, Post, Res, UseGuards} from '@nestjs/common';
import {createHmac} from 'crypto';
import { URLSearchParams } from 'url';

import {ADGroupsGuard, ConfigService, EREQUIRED_GROUPS, LoggerService, RequiredADGroups, User} from '../modules';

@ApiTags(EModules.KITCHEN)
@RequiredADGroups(EREQUIRED_GROUPS.CHOICE)
@UseGuards(ADGroupsGuard)
@Controller('choice')
export class ChoiceController {

    constructor(
        private _logger: LoggerService,
        private _config: ConfigService,
    ) {
    }

    @Post()
    generateToken(@User('username') username: string, @Body() body: { vk_user_id: string }, @Res() res: Response) {
        this._logger.info(`${username} making choice token for vk_user_id: ${body.vk_user_id}`)
        try {
            const params = new URLSearchParams({
                vk_user_id: body.vk_user_id,
            });
            const sign: string = this._generateVkMiniAppSign(this._config.CHOICE.APP_SECRET, params.toString());
            params.append('sign', sign);
            res.json({sign: params.toString()});
        } catch (error) {
            this._logger.error(error);
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({message: error.toString()});
        }
    }

    private _generateVkMiniAppSign(secret: string, body: string): string {
        return createHmac('sha256', secret)
            .update(body)
            .digest()
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=$/, '');
    }

}

