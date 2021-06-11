import {EModules, IHost} from '@kitchen/api-interfaces';
import {HostEntity} from '@kitchen/domain';
import {Body, Controller, Delete, Get, Param, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {HostService} from '../services';

@ApiTags(EModules.LANDSCAPE)
@UseGuards(AuthGuard())
@Controller('landscape/host')
export class HostController {
    constructor(
        private readonly _service: HostService,
    ) {}

    @ApiResponse({status: 200, type: HostEntity, isArray: true})
    @Get('search')
    search(
        @Query('dnsname') dnsname: string
    ): Promise<IHost[]> {
        return this._service.search(dnsname);
    }

    @ApiResponse({status: 200, type: HostEntity, isArray: true})
    @Get()
    findAll(): Promise<HostEntity[]> {
        return this._service.findAll();
    }

    @ApiResponse({status: 200, type: HostEntity})
    @Get(':id')
    findOne(@Param('id') id: number): Promise<IHost> {
        return this._service.findOne(id);
    }

    @ApiResponse({status: 200, type: HostEntity})
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: HostEntity
    ): Promise<IHost> {
        return this._service.updateOne(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
