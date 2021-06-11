import {ECertificateJobStatus, ICertificate, ICertificateJob} from '@kitchen/api-interfaces';
import {BaseEntity, CertEntity} from '@kitchen/domain';
import {ApiProperty} from '@nestjs/swagger';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';

@Entity({
    name: 'cert-job',
    orderBy: {
        'created': 'ASC'
    },
})
export class CertificateJobEntity extends BaseEntity implements ICertificateJob {
    @ApiProperty()
    @Column()
    emails: string;

    @ApiProperty()
    @Column({type: 'varchar2', width: 10})
    status: ECertificateJobStatus;

    @ManyToOne(type => CertEntity, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'cert_id'
    })
    cert: ICertificate;
}
