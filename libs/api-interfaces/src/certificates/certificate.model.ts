import {IBaseDomain} from '../landscape';

export const CERTIFICATE_JOB_SEPARATOR = '; ';

export interface ICertificateJob extends IBaseDomain {
    emails: string;
    status: ECertificateJobStatus;
    cert?: ICertificate;
}

export interface ICertificate extends IBaseDomain {
    subject: string;
    validFrom: string;
    validTo: string;
    alertDate: string;
    jobs: ICertificateJob[];
}

export interface ICertificateFile extends IBaseDomain {
    name: string;
    file: string;
    status: ECertificatesFileStatus;
    certs: ICertificate[];
}

export enum ECertificatesFileStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
}

export enum ECertificateJobStatus {
    PENDING = 'PENDING',
    DONE = 'DONE',
}
