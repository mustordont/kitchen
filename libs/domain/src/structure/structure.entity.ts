import {ApiProperty} from '@nestjs/swagger';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity({
    name: 'structure'
})
export class StructureEntity {
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

    @ApiProperty()
    @Column({type: 'nclob'})
    json: string;
}
