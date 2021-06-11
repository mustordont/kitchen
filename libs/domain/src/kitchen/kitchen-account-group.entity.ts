import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {AccountGroup} from '@kitchen/api-interfaces';

@Entity({
    name: 'kitchen_groups',
})
export class KitchenAccountGroupEntity extends AccountGroup {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @ApiProperty()
    @Column({unique: true})
    name: string;

    @ApiProperty()
    @Column()
    ctx: boolean;
}
