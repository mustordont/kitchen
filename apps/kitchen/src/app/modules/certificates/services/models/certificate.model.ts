import {BaseModel, ICertificate} from '@kitchen/api-interfaces';
import {CertificateJobModel} from './certificate-job.model';

export class CertificateModel extends BaseModel {
    public readonly active: boolean = true;

    public readonly subject: string;
    public readonly validFrom?: Date;
    public readonly validTo?: Date;
    public readonly alertDate?: Date;
    public readonly jobs: CertificateJobModel[] = [];

    constructor(data: ICertificate & {active?: boolean}) {
        super(data);
        this.active = data.active ?? true;
        this.subject = data.subject;
        if (data.validFrom) {
            this.validFrom = new Date(data.validFrom);
        }
        if (data.validTo) {
            this.validTo = new Date(data.validTo);
        }
        if (data.alertDate) {
            this.alertDate = new Date(data.alertDate);
        }
        if (Array.isArray(data.jobs)) {
            this.jobs = data.jobs.map(i => new CertificateJobModel(i));
        }
    }

    public serialize(): ICertificate {
        return {
            id: this.id,
            subject: this.subject,
            validFrom: this.validFrom?.toISOString() ?? null,
            validTo: this.validTo?.toISOString() ?? null,
            alertDate: this.alertDate?.toISOString() ?? null,
            jobs: this.jobs.map(i => i.serialize()),
        };
    }
}
