import {Injectable} from '@nestjs/common';
import {OracleConnectionOptions} from 'typeorm/driver/oracle/OracleConnectionOptions';
import {LoggerOptions} from 'typeorm/logger/LoggerOptions';

export interface IAppConfigAD {
    HOST: string;
    DOMAIN: string;
    USER: string;
    PWD: string;
    BASEDN: string;
}

export interface IAppConfigChoice {
    APP_ID: string;
    APP_SECRET: string;
}

export enum EREQUIRED_GROUPS {
    EMPLOYEE = 'EMPLOYEE',
    CHOICE = 'CHOICE',
    CERTIFICATE = 'CERTIFICATE'
}

@Injectable()
export class ConfigService {

    public readonly LOGS_FOLDER: string;
    public readonly JWT_SECRET: string;
    public readonly AD: IAppConfigAD;
    public readonly CHOICE: IAppConfigChoice;
    public readonly REQUIRED_GROUPS: {
        [key in EREQUIRED_GROUPS]: string[]
    };
    public readonly KITCHEN_ENDPOINT: string;
    public readonly SEND_NOTIFICATION: string;

    public readonly DB: OracleConnectionOptions;

    constructor() {
        const {
            LOGS_FOLDER,
            JWT_SECRET,
            AD_HOST,
            AD_DOMAIN,
            AD_USER,
            AD_PWD,
            AD_BASEDN,
            CHOICE_API_ID,
            CHOICE_API_SECRET,
            GROUPS_REQUIRED_EMPLOYEE,
            GROUPS_REQUIRED_CHOICE,
            GROUPS_REQUIRED_CERTIFICATES,
            KITCHEN_ENDPOINT,
            SEND_NOTIFICATION,
            TYPEORM_LOGGING,
            TYPEORM_CONNECTION,
            TYPEORM_USERNAME,
            TYPEORM_PASSWORD,
            TYPEORM_HOST,
            TYPEORM_PORT,
            TYPEORM_SID,
        } = process.env;
        this.LOGS_FOLDER = LOGS_FOLDER;
        this.AD = {
            HOST: AD_HOST,
            DOMAIN: AD_DOMAIN,
            USER: AD_USER,
            PWD: AD_PWD,
            BASEDN: AD_BASEDN,
        };
        this.JWT_SECRET = JWT_SECRET;
        this.CHOICE = {
            APP_ID: CHOICE_API_ID,
            APP_SECRET: CHOICE_API_SECRET,
        };
        this.REQUIRED_GROUPS = {
            EMPLOYEE: GROUPS_REQUIRED_EMPLOYEE.split(','),
            CHOICE: GROUPS_REQUIRED_CHOICE.split(','),
            CERTIFICATE: GROUPS_REQUIRED_CERTIFICATES.split(','),
        };
        this.KITCHEN_ENDPOINT = KITCHEN_ENDPOINT;
        this.SEND_NOTIFICATION = SEND_NOTIFICATION;
        this.DB = {
            type: TYPEORM_CONNECTION as 'oracle',
            logging: this._parseString(TYPEORM_LOGGING),
            username: TYPEORM_USERNAME,
            password: TYPEORM_PASSWORD,
            host: TYPEORM_HOST,
            port: +TYPEORM_PORT,
            sid: TYPEORM_SID,
        }
    }

    private _parseString(value: string): LoggerOptions {
        switch(value.toLowerCase().trim()){
            case "true":
            case "yes":
            case "1":
                return true;
            case "false":
            case "no":
            case "0":
            case null:
                return false;
            default:
                return value as LoggerOptions;
        }
    }
}
