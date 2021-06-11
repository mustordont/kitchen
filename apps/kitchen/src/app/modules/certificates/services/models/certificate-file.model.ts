import {BaseModel, ECertificatesFileStatus, ICertificateFile} from '@kitchen/api-interfaces';
import {CertificateModel} from './certificate.model';

export class CertificateFileModel extends BaseModel {
    public readonly name: string;
    public readonly file: string;
    public readonly status: ECertificatesFileStatus;
    public readonly certs: CertificateModel[];
    constructor(data: ICertificateFile) {
        super(data);
        this.name = data.name;
        this.file = data.file;
        this.status = data.status;
        this.certs = data.certs.map(i => new CertificateModel(i));
    }

    public serialize(): ICertificateFile {
        return {
            id: this.id,
            name: this.name,
            file: this.file,
            status: this.status,
            certs: this.certs.map(i => i.serialize()),
        };
    }
}
