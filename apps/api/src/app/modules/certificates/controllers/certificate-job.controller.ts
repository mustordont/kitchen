import {EModules, ICertificateJob} from '@kitchen/api-interfaces';
import {CertificateJobEntity} from '@kitchen/domain';
import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {CertificateJobService} from '../services';

@ApiTags(EModules.CERTIFICATES)
@UseGuards(AuthGuard())
@Controller('certificate/job')
export class CertificateJobController {
    constructor(
        private readonly _service: CertificateJobService,
    ) {}

    @ApiResponse({status: 200, type: CertificateJobEntity, isArray: true})
    @Get()
    findAll(): Promise<ICertificateJob[]> {
        return this._service.findAll();
    }

    @ApiResponse({status: 200, type: CertificateJobEntity})
    @Post()
    create(@Body() data: CertificateJobEntity): Promise<ICertificateJob> {
        return this._service.addOne(data);
    }

    @ApiResponse({status: 200, type: CertificateJobEntity})
    @Get(':id')
    findOne(@Param('id') id: number): Promise<ICertificateJob> {
        return this._service.findOne(id);
    }

    @ApiResponse({status: 200, type: CertificateJobEntity})
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: CertificateJobEntity
    ): Promise<ICertificateJob> {
        return this._service.updateOne(id, data);
    }

    @ApiResponse({status: 200})
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
