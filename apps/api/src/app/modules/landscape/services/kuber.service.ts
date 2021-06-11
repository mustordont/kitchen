import {KuberEntity} from '@kitchen/domain';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Like, Repository} from 'typeorm';
import { BaseCrudService } from '../../base-crud.service';
import {LoggerService} from '../../logger';

@Injectable()
export class KuberService extends BaseCrudService<KuberEntity> {
    constructor(
        @InjectRepository(KuberEntity) repo: Repository<KuberEntity>,
        logger: LoggerService,
    ) {
        super(repo, logger);
    }

    async search(namespace: string): Promise<KuberEntity[]> {
        return await this.ormRepo.find({
            where: {
                namespace: Like(`%${namespace}%`),
            },
            take: 10,
            order: {
                id: 'ASC'
            },
        });
    }
}
