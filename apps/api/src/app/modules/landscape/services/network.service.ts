import {HostEntity, NetworkEntity} from '@kitchen/domain';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BaseCrudService} from '../../base-crud.service';
import {LoggerService} from '../../logger';
import {HostService} from './host.service';

@Injectable()
export class NetworkService extends BaseCrudService<NetworkEntity> {
    constructor(
        @InjectRepository(NetworkEntity) repo: Repository<NetworkEntity>,
        private _hostService: HostService,
        logger: LoggerService,
    ) {
        super(repo, logger);
    }

    async delete(id: number) {
        const network = await this.ormRepo.findOne(id) as NetworkEntity;
        if (!network) {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
        await Promise.all(network.hosts.map(async (i: HostEntity) => await this._hostService.delete(i.id)));
        return await this.ormRepo.delete(id);
    }
}
