import {EModules, INetwork} from '@kitchen/api-interfaces';
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
import {NetworkService} from '../services';
import {HostEntity, NetworkEntity} from '@kitchen/domain';
import {ApiResponse, ApiTags} from '@nestjs/swagger';

@ApiTags(EModules.LANDSCAPE)
@UseGuards(AuthGuard())
@Controller('landscape/network')
export class NetworkController {
    constructor(
        private readonly _service: NetworkService,
    ) {}

    @ApiResponse({ status: 200, type: NetworkEntity, isArray: true })
    @Get()
    findAll(): Promise<NetworkEntity[]> {
        return this._service.findAll();
    }

    @Post(':id/host')
    async addHost(@Param('id') id: number, @Body() data: HostEntity): Promise<INetwork> {
        const network: NetworkEntity = await this._service.findOne(id);
        if (network) {
            network.hosts.push(data);
            return this._service.updateOne(id, network);
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }

    @ApiResponse({ status: 200, type: NetworkEntity})
    @Get(':id')
    findOne(@Param('id') id: number): Promise<INetwork> {
        return this._service.findOne(id);
    }

    @ApiResponse({ status: 200, type: NetworkEntity})
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: NetworkEntity
    ): Promise<INetwork> {
        return this._service.updateOne(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
