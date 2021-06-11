import {EModules, IKuber} from '@kitchen/api-interfaces';
import {KuberEntity} from '@kitchen/domain';
import {Body, Controller, Delete, Get, Param, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {KuberService} from '../services';

@ApiTags(EModules.LANDSCAPE)
@UseGuards(AuthGuard())
@Controller('landscape/kuber')
export class KuberController {
    constructor(
        private readonly _service: KuberService,
    ) {
    }

    @ApiResponse({status: 200, type: KuberEntity, isArray: true})
    @Get('search')
    search(
        @Query('namespace') namespace: string
    ): Promise<IKuber[]> {
        return this._service.search(namespace);
    }

    @ApiResponse({status: 200, type: KuberEntity, isArray: true})
    @Get()
    findAll(): Promise<KuberEntity[]> {
        return this._service.findAll();
    }

    @ApiResponse({status: 200, type: KuberEntity})
    @Get(':id')
    findOne(@Param('id') id: number): Promise<IKuber> {
        return this._service.findOne(id);
    }

    @ApiResponse({status: 200, type: KuberEntity, isArray: true})
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: KuberEntity
    ): Promise<IKuber> {
        return this._service.updateOne(id, data);
    }

    @ApiResponse({status: 200})
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
