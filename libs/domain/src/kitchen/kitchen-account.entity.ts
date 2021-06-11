import {AccountBase} from '@kitchen/api-interfaces';
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {KitchenAccountGroupEntity} from './kitchen-account-group.entity';

@Entity({
    name: 'kitchen_accounts',
})
export class KitchenAccountEntity extends AccountBase {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    public id: number;

    @ApiProperty()
    @Column()
    public readonly name: string;

    @ApiProperty()
    @Column()
    public readonly fullName: string;

    @ApiProperty()
    @Column({unique: true})
    public readonly username: string;

    @ApiProperty()
    @Column()
    public readonly mail: string;

    @ApiProperty()
    @Column()
    public readonly mobile: string;

    @ApiProperty()
    @Column()
    public readonly birthDate: string;

    @ApiProperty()
    @Column()
    public readonly city: string;

    @ApiProperty()
    @Column()
    public readonly title: string;

    @ApiProperty()
    @Column()
    public readonly department: string;

    @ApiProperty()
    @Column()
    public readonly division: string;

    @ApiProperty()
    @Column()
    public readonly inDate: string;

    @ApiProperty()
    @Column()
    public readonly vkID: string;

    @ApiProperty()
    @Column({
        type: 'clob',
        nullable: true,
    })
    public readonly thumbnailPhoto?: string;

    @ApiProperty({ type: KitchenAccountGroupEntity, isArray: true })
    @ManyToMany(type => KitchenAccountGroupEntity, {eager: true})
    @JoinTable({
        name: 'kitchen_account_groups',
        joinColumn: {
            name: 'account',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'group',
            referencedColumnName: 'id'
        }
    })
    public groups: KitchenAccountGroupEntity[];
}
