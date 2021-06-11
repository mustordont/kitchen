import {HttpException, HttpStatus} from '@nestjs/common';
import {Repository} from 'typeorm';
import {BaseEntity} from '@kitchen/domain';
import {LoggerService} from './logger';

export abstract class BaseCrudService<T extends BaseEntity> {
    constructor(
        public readonly ormRepo: Repository<T>,
        protected _logger: LoggerService,
    ) {
    }

    async findAll(): Promise<T[]> {
        return await this.ormRepo.find({
            order: {
                created: 'ASC'
            }
        });
    }

    async findOne(id: number): Promise<T> {
        const obj = await this.ormRepo.findOne(id, {
            order: {
                created: 'ASC'
            }
        });
        if (obj) {
            return obj;
        }
        throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    async addOne(p: any): Promise<T> {
        delete p.id;
        try {
            await this.ormRepo.save(p);
            return p;
        }
        catch (e) {
            this._logger.error(e);
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateOne(idToUpdate: number, p: any): Promise<T> {
        const obj: T = await this.ormRepo.findOne(idToUpdate);
        if (obj) {
            return await this.ormRepo.save({
                ...obj,
                ...p,
                updated: new Date(),
            });
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }

    async delete(id: number) {
        if (await this.findOne(id)) {
            return await this.ormRepo.delete(id);
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }
}


