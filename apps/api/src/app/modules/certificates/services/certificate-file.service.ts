import {ECertificatesFileStatus} from '@kitchen/api-interfaces';
import {CertFileEntity} from '@kitchen/domain';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BaseCrudService} from '../../base-crud.service';
import {LoggerService} from '../../logger';

@Injectable()
export class CertificateFileService extends BaseCrudService<CertFileEntity> {
    constructor(
        @InjectRepository(CertFileEntity) repo: Repository<CertFileEntity>,
        logger: LoggerService,
    ) {
        super(repo, logger);
    }

    async findAll(): Promise<CertFileEntity[]> {
        return await this.ormRepo.find({
            where: {
                status: ECertificatesFileStatus.ACTIVE
            },
            order: {
                created: 'ASC'
            },
            relations: ['certs']
        });
    }

    async findOne(id: number): Promise<CertFileEntity> {
        const obj = await this.ormRepo.findOne(id, {
            where: {
                status: ECertificatesFileStatus.ACTIVE
            },
            order: {
                created: 'ASC'
            },
            relations: ['certs']
        });
        if (obj) {
            return obj;
        }
        throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    async delete(id: number): Promise<any> {
        const certFile: CertFileEntity = await this.ormRepo.findOne(id);
        if (certFile) {
            certFile.status = ECertificatesFileStatus.DELETED;
            return await this.updateOne(id, certFile);
        } else {
            throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
        }
    }
}
