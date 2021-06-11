import {ApplicationEntity, GroupEntity} from '@kitchen/domain';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BaseCrudService} from '../../base-crud.service';
import {LoggerService} from '../../logger';
import {ApplicationService} from './application.service';

@Injectable()
export class GroupService extends BaseCrudService<GroupEntity> {
    constructor(
        @InjectRepository(GroupEntity) repo: Repository<GroupEntity>,
        private _appService: ApplicationService,
        logger: LoggerService,
    ) {
        super(repo, logger);
    }

    async delete(id: number) {
        const group = await this.ormRepo.findOne(id) as GroupEntity;
        if (!group) {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
        await Promise.all(group.applications.map(async (i: ApplicationEntity) => await this._appService.delete(i.id)));
        return await this.ormRepo.delete(id);
    }
}
