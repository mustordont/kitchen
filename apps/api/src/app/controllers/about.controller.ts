import {EModules} from '@kitchen/api-interfaces';
import {KitchenAboutDto} from '@kitchen/domain';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {Response} from 'express';
import {Controller, Get, Res} from '@nestjs/common';

import {author} from '../../../../../package.json';
import {version} from '../../../package.json';

@ApiTags(EModules.KITCHEN)
@Controller('/')
export class AboutController {

    @ApiResponse({ status: 200, type: KitchenAboutDto })
    @Get()
    getAbout(@Res() res: Response) {
        res.send({
            authors: [author],
            apiVersion: version,
        });
    }
}
