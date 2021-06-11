import {
    ECertificateJobStatus,
    ECertificatesFileStatus,
    ICertificate,
    ICertificateFile,
    ICertificateJob
} from '@kitchen/api-interfaces';
import {ApiProperty} from '@nestjs/swagger';
import {AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import {BaseEntity} from '../landscape';
import {CertificateJobEntity} from './certificate-job.entity';

@Entity({
    name: 'cert-file',
    orderBy: {
        'created': 'ASC'
    },
})
export class CertFileEntity extends BaseEntity implements ICertificateFile {
    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({type: 'nclob'})
    file: string;

    @ApiProperty()
    @Column({type: 'varchar2', default: () => ECertificatesFileStatus.ACTIVE})
    status: ECertificatesFileStatus;

    @ApiProperty({ type: () => CertEntity, isArray: true})
    @OneToMany(type => CertEntity, cert => cert.certFile, {cascade: true})
    @JoinColumn()
    certs: ICertificate[];
}

@Entity({
    name: 'cert',
    orderBy: {
        'created': 'ASC'
    },
})
export class CertEntity extends BaseEntity implements ICertificate {
    @ApiProperty()
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    validFrom: string;

    @ApiProperty()
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    validTo: string;

    @ApiProperty()
    @Column()
    subject: string;

    @ManyToOne( type => CertFileEntity, {onDelete: 'CASCADE'})
    @JoinColumn()
    certFile: ICertificateFile;

    @ApiProperty()
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    alertDate: string;

    @ApiProperty({ type: () => CertificateJobEntity, isArray: true})
    @OneToMany(type => CertificateJobEntity, job => job.cert, {onDelete: 'CASCADE', eager: true, cascade: true})
    jobs: ICertificateJob[];

    @AfterLoad()
    sortAttributes() {
        this.jobs?.sort((a, b) => (a.status === ECertificateJobStatus.DONE ? -1 : 0));
        console.log('sorted', this.jobs);
    }
}
