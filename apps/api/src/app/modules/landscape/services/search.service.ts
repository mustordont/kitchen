import {
    ApplicationEntity,
    DomainEntity,
    LandscapeSearchHostPageDto, LandscapeSearchHostResultDto,
    LandscapeSearchKuberPageDto,
    LandscapeSearchKuberResultDto,
    LandscapeSearchRequestBaseDto,
    LandscapeSearchRequestKuberDto
} from '@kitchen/domain';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(ApplicationEntity) private _repository: Repository<ApplicationEntity>,
        @InjectRepository(DomainEntity) private _domainRepository: Repository<DomainEntity>,
    ) {
    }

    public async searchAppsByKuber(request: LandscapeSearchRequestKuberDto): Promise<LandscapeSearchKuberPageDto> {
        const queryBuilder = this._domainRepository.createQueryBuilder('domain')
            .leftJoinAndSelect('domain.groups', 'group')
            .leftJoinAndSelect('domain.kubers', 'kuber')
            .leftJoinAndSelect('kuber.applications', 'application');

        if (request.domain) {
            queryBuilder
                .where('domain.id = :id', {id: request.domain});
        }
        if (request.group) {
            queryBuilder
                .andWhere('group.id = :id', {id: request.group});
        }
        if (request.kuber) {
            queryBuilder
                .andWhere('kuber.id = :id', {id: request.kuber});
        }
        const totalQueryBuilder = queryBuilder.clone();

        const [items, total] = await Promise.all([
            queryBuilder
                .limit(request.pageSize)
                .offset((request.page - 1) * request.pageSize)
                .getRawMany<LandscapeSearchKuberResultDto>(),
            totalQueryBuilder.getCount(),
        ]);

        return {
            items,
            total,
            page: request.page,
            pageSize: request.pageSize,
        };
    }

    public async searchAppsByHost(request: LandscapeSearchRequestBaseDto): Promise<LandscapeSearchHostPageDto> {
        const queryBuilder = this._domainRepository.createQueryBuilder('domain')
            .leftJoinAndSelect('domain.groups', 'group')
            .leftJoinAndSelect('domain.networks', 'network')
            .leftJoinAndSelect('network.hosts', 'host')
            .leftJoinAndSelect('host.applications', 'application');

        if (request.domain) {
            queryBuilder
                .where('domain.id = :id', {id: request.domain});
        }
        if (request.group) {
            queryBuilder
                .andWhere('group.id = :id', {id: request.group});
        }

        const totalQueryBuilder = queryBuilder.clone();

        const [items, total] = await Promise.all([
            queryBuilder
                .limit(request.pageSize)
                .offset((request.page - 1) * request.pageSize)
                .getRawMany<LandscapeSearchHostResultDto>(),
            totalQueryBuilder.getCount(),
        ]);

        return {
            items,
            total,
            page: request.page,
            pageSize: request.pageSize,
        };
    }
}
