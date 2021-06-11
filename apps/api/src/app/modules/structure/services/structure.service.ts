import {StructureEntity} from '@kitchen/domain';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {LoggerService} from '../../logger';

@Injectable()
export class StructureService {
    constructor(
        @InjectRepository(StructureEntity) private _repo: Repository<StructureEntity>,
        private _logger: LoggerService,
    ) {
    }

    async save(json: any): Promise<StructureEntity> {
        this._logger.info('updates structure');
        return await this._repo.save({
            id: 1,
            json,
        });
    }

    async get(): Promise<string> {
        return await this._repo.findOne(1)
            .then((data: StructureEntity) => JSON.parse(data.json));
    }
}
