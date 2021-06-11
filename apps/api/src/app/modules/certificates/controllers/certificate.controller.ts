import {EModules, ICertificate} from '@kitchen/api-interfaces';
import {CertEntity} from '@kitchen/domain';
import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {CertificateService} from '../services';

@ApiTags(EModules.CERTIFICATES)
@UseGuards(AuthGuard())
@Controller('certificate')
export class CertificateController {
    constructor(
        private readonly _service: CertificateService,
    ) {}

    @ApiResponse({ status: 200, type: CertEntity, isArray: true })
    @Get()
    findAll(): Promise<ICertificate[]> {
        return this._service.findAll();
    }

    @ApiResponse({ status: 200, type: CertEntity})
    @Post()
    create(@Body() data: CertEntity): Promise<ICertificate> {
        return this._service.addOne(data);
    }

    @ApiResponse({ status: 200, type: CertEntity})
    @Get(':id')
    findOne(@Param('id') id: number): Promise<ICertificate> {
        return this._service.findOne(id);
    }

    @ApiResponse({ status: 200, type: CertEntity})
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: CertEntity
    ): Promise<ICertificate> {
        return this._service.updateOne(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
