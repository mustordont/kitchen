import {IAccount} from '@kitchen/api-interfaces';
import {KitchenAccountEntity} from '@kitchen/domain';
import {AbstractRepository, EntityRepository, getCustomRepository} from 'typeorm';
import {AccountGroupRepository} from './account-group-repository';

@EntityRepository(KitchenAccountEntity)
export class AccountRepository extends AbstractRepository<KitchenAccountEntity> {
    async createAndSave(userData: IAccount): Promise<KitchenAccountEntity> {
        const userGroupRepository: AccountGroupRepository = getCustomRepository(AccountGroupRepository);
        const {groups} = userData;
        delete userData.groups;
        const user: KitchenAccountEntity = new KitchenAccountEntity(userData);
        user.groups = await userGroupRepository.updateGroups(groups);
        const existsUser: KitchenAccountEntity = await this.findByLogin(user.username);
        if (existsUser) {
            user.id = existsUser.id;
        }
        return await this.manager.save(user);
    }

    findByLogin(sAMAccountName: string): Promise<KitchenAccountEntity> {
        return this.manager.findOne(KitchenAccountEntity, {username: sAMAccountName});
    }
}
