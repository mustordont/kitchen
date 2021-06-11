import {DomainEntity} from '@kitchen/domain';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BaseCrudService} from '../../base-crud.service';
import {LoggerService} from '../../logger';

@Injectable()
export class DomainService extends BaseCrudService<DomainEntity> {
    constructor(
        @InjectRepository(DomainEntity) repo: Repository<DomainEntity>,
        logger: LoggerService,
    ) {
        super(repo, logger);
    }
}
