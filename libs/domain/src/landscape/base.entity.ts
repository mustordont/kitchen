import {ApiProperty} from '@nestjs/swagger';
import {Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

// for type "timestamp"
// https://stackoverflow.com/questions/49463691/typeorm-column-type-dependant-on-database/61472440#61472440

export abstract class BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({required: false})
    @CreateDateColumn({type: "timestamp"})
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created: string;

    @ApiProperty({required: false})
    @UpdateDateColumn({type: "timestamp"})
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated: string;
}
