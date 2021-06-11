import {EModules, IGroup} from '@kitchen/api-interfaces';
import {ApplicationEntity, GroupEntity} from '@kitchen/domain';
import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {GroupService} from '../services';

@ApiTags(EModules.LANDSCAPE)
@UseGuards(AuthGuard())
@Controller('landscape/group')
export class GroupController {
    constructor(
        private readonly _service: GroupService,
    ) {}

    @ApiResponse({ status: 200, type: GroupEntity, isArray: true })
    @Get()
    findAll(): Promise<GroupEntity[]> {
        return this._service.findAll();
    }

    @ApiResponse({ status: 200, type: GroupEntity })
    @Get(':id')
    findOne(@Param('id') id: number): Promise<IGroup> {
        return this._service.findOne(id);
    }

    @ApiResponse({ status: 200, type: GroupEntity})
    @Post(':id/application')
    async addApplication(@Param('id') id: number, @Body() data: ApplicationEntity): Promise<IGroup> {
        const group: GroupEntity = await this._service.findOne(id);
        if (group) {
            group.applications.push(data);
            return this._service.updateOne(id, group);
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }

    @ApiResponse({ status: 200, type: GroupEntity})
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() data: GroupEntity
    ): Promise<IGroup> {
        return this._service.updateOne(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
