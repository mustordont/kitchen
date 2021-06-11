import {EModules, ICertificateFile} from '@kitchen/api-interfaces';
import {CertEntity, CertFileEntity} from '@kitchen/domain';
import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {CertificateFileService} from '../services';

@ApiTags(EModules.CERTIFICATES)
@UseGuards(AuthGuard())
@Controller('certificate/file')
export class CertificateFileController {
    constructor(
        private readonly _service: CertificateFileService,
    ) {}

    @ApiResponse({ status: 200, type: CertFileEntity, isArray: true })
    @Get()
    findAll(): Promise<ICertificateFile[]> {
        return this._service.findAll();
    }

    @ApiResponse({ status: 200, type: CertFileEntity})
    @Post()
    create(@Body() data: CertFileEntity): Promise<ICertificateFile> {
        return this._service.addOne(data);
    }

    @ApiResponse({ status: 200, type: CertFileEntity})
    @Get(':id')
    findOne(@Param('id') id: number): Promise<ICertificateFile> {
        return this._service.findOne(id);
    }

    @ApiResponse({ status: 200, type: CertFileEntity})
    @Get(':id/certificate')
    async addCertificate(@Param('id') id: number, @Body() data: CertEntity): Promise<ICertificateFile> {
        const certFiles: CertFileEntity = await this._service.findOne(id);
        if (certFiles) {
            certFiles.certs.push(data);
            return this._service.updateOne(id, certFiles);
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }

    @ApiResponse({ status: 200, type: CertFileEntity})
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: CertFileEntity
    ): Promise<ICertificateFile> {
        return this._service.updateOne(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
