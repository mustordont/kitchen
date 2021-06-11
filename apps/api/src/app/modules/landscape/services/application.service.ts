import {ApplicationEntity} from '@kitchen/domain';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BaseCrudService} from '../../base-crud.service';
import {LoggerService} from '../../logger';

@Injectable()
export class ApplicationService extends BaseCrudService<ApplicationEntity> {
    constructor(
        @InjectRepository(ApplicationEntity) repo: Repository<ApplicationEntity>,
        logger: LoggerService,
    ) {
        super(repo, logger);
    }
}
