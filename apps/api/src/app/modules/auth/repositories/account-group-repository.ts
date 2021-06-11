import {IAccountGroup} from '@kitchen/api-interfaces';
import {KitchenAccountGroupEntity} from '@kitchen/domain';
import {AbstractRepository, EntityRepository, In} from 'typeorm';

@EntityRepository(KitchenAccountGroupEntity)
export class AccountGroupRepository extends AbstractRepository<KitchenAccountGroupEntity> {
    createAndSave(groupData: IAccountGroup): Promise<KitchenAccountGroupEntity> {
        const group: KitchenAccountGroupEntity = new KitchenAccountGroupEntity(groupData);
        return this.manager.save(group);
    }

    findByName(name: string): Promise<KitchenAccountGroupEntity> {
        return this.manager.findOne(KitchenAccountGroupEntity, {name});
    }

    /**
     * create new groups if they are not exist only
     * @param groups IUserGroup[]
     */
    async updateGroups(groups: IAccountGroup[]): Promise<KitchenAccountGroupEntity[]> {
        const existGroups: KitchenAccountGroupEntity[] = await this.repository.find({
            where: {
                name: In(groups.map(i => i.name)),
            }
        });
        const createdGroups: KitchenAccountGroupEntity[] = await Promise.all(
            groups
                .filter(i => !existGroups.find(j => j.name === i.name))
                .map((i) => this.createAndSave(i)),
        );
        return [...existGroups, ...createdGroups];
    }
}
