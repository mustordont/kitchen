import {ECertificatesFileStatus, ICertificateFile} from '@kitchen/api-interfaces';
import {CertEntity} from '@kitchen/domain';
import {ApiProperty} from '@nestjs/swagger';

export class CertificateAnalyzeDto implements ICertificateFile {
    @ApiProperty()
    name: string;

    @ApiProperty()
    file: string;

    @ApiProperty()
    status: ECertificatesFileStatus;

    @ApiProperty({type: () => CertEntity, isArray: true})
    certs: CertEntity[];
}
