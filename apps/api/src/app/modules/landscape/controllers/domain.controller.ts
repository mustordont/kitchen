import {EModules, IDomain} from '@kitchen/api-interfaces';
import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete, HttpException, HttpStatus, UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {DomainService} from '../services';
import {DomainEntity, GroupEntity, KuberEntity, NetworkEntity} from '@kitchen/domain';
import {ApiResponse, ApiTags} from '@nestjs/swagger';

@ApiTags(EModules.LANDSCAPE)
@UseGuards(AuthGuard())
@Controller('landscape/domain')
export class DomainController {
    constructor(
        private readonly _service: DomainService,
    ) {}

    @ApiResponse({ status: 200, type: DomainEntity, isArray: true })
    @Get()
    findAll(): Promise<IDomain[]> {
        return this._service.findAll();
    }

    @ApiResponse({ status: 200, type: DomainEntity})
    @Post()
    create(@Body() data: DomainEntity): Promise<IDomain> {
        return this._service.addOne(data);
    }

    @ApiResponse({ status: 200, type: DomainEntity})
    @Post(':id/network')
    async addNetwork(@Param('id') id: number, @Body() data: NetworkEntity): Promise<IDomain> {
        const domain: DomainEntity = await this._service.findOne(id);
        if (domain) {
            domain.networks.push(data);
            return this._service.updateOne(id, domain);
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }

    @ApiResponse({ status: 200, type: DomainEntity})
    @Post(':id/group')
    async addGroup(@Param('id') id: number, @Body() data: GroupEntity): Promise<IDomain> {
        const domain: DomainEntity = await this._service.findOne(id);
        if (domain) {
            domain.groups.push(data);
            return this._service.updateOne(id, domain);
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }

    @ApiResponse({ status: 200, type: DomainEntity})
    @Post(':id/kuber')
    async addKuber(@Param('id') id: number, @Body() data: KuberEntity): Promise<IDomain> {
        const domain: DomainEntity = await this._service.findOne(id);
        if (domain) {
            domain.kubers.push(data);
            return this._service.updateOne(id, domain);
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }

    @ApiResponse({ status: 200, type: DomainEntity})
    @Get(':id')
    findOne(@Param('id') id: number): Promise<IDomain> {
        return this._service.findOne(id);
    }

    @ApiResponse({ status: 200, type: DomainEntity})
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: DomainEntity
    ): Promise<IDomain> {
        return this._service.updateOne(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
