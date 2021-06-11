import {BaseModel, ECertificateJobStatus, ICertificateJob} from '@kitchen/api-interfaces';

export class CertificateJobModel extends BaseModel {
    public readonly emails: string;
    public readonly status: ECertificateJobStatus;
    constructor(data: ICertificateJob) {
        super(data);
        this.emails = data.emails;
        this.status = data.status;
    }

    public serialize(): ICertificateJob {
        return {
            emails: this.emails,
            status: this.status,
        };
    }
}
