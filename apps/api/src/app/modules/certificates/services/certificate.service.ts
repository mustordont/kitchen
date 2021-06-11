import {CertEntity} from '@kitchen/domain';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BaseCrudService} from '../../base-crud.service';
import {LoggerService} from '../../logger';

@Injectable()
export class CertificateService extends BaseCrudService<CertEntity> {
    constructor(
        @InjectRepository(CertEntity) repo: Repository<CertEntity>,
        logger: LoggerService,
    ) {
        super(repo, logger);
    }
}
