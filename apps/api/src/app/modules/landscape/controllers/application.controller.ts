import {EModules, IApplication, IGroup} from '@kitchen/api-interfaces';
import {ApplicationEntity, GroupEntity} from '@kitchen/domain';
import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {ApplicationService, GroupService} from '../services';

@ApiTags(EModules.LANDSCAPE)
@UseGuards(AuthGuard())
@Controller('landscape/application')
export class ApplicationController {
    constructor(
        private readonly _service: ApplicationService,
        private readonly _groupService: GroupService,
    ) {
    }

    @ApiResponse({status: 200, type: ApplicationEntity, isArray: true})
    @Get()
    findAll(): Promise<IApplication[]> {
        return this._service.findAll();
    }

    @ApiResponse({status: 200, type: ApplicationEntity})
    @Get(':id')
    findOne(@Param('id') id: number): Promise<IApplication> {
        return this._service.findOne(id);
    }

    @ApiResponse({status: 200, type: ApplicationEntity, isArray: true})
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() data: {
            group: GroupEntity,
            application: ApplicationEntity,
        }
    ): Promise<IGroup> {
        const group: GroupEntity = await this._groupService.findOne(data.group.id);
        if (!group) {
            throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
        }
        group.applications.push(data.application);
        return this._groupService.updateOne(group.id, group);
    }

    @ApiResponse({status: 200})
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this._service.delete(id);
    }
}
