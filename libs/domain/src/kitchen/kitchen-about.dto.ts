import {IAbout} from '@kitchen/api-interfaces';
import {ApiProperty} from '@nestjs/swagger';

export class KitchenAboutDto implements IAbout {
    @ApiProperty()
    authors: string[];
    @ApiProperty()
    apiVersion: string;
}
