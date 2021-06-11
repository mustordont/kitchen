import {HostEntity} from '@kitchen/domain';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Like, Repository} from 'typeorm';
import {BaseCrudService} from '../../base-crud.service';
import {LoggerService} from '../../logger';

@Injectable()
export class HostService extends BaseCrudService<HostEntity> {
    constructor(
        @InjectRepository(HostEntity) repo: Repository<HostEntity>,
        logger: LoggerService,
    ) {
        super(repo, logger);
    }

    async search(dnsname: string): Promise<HostEntity[]> {
        return await this.ormRepo.find({
            where: {
                dnsname: Like(`%${dnsname}%`),
            },
            take: 10,
            order: {
                id: 'ASC'
            },
        });
    }
}
