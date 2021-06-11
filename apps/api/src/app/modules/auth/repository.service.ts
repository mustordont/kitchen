import {Injectable} from '@nestjs/common';
import {AccountGroupRepository, AccountRepository} from './repositories';

@Injectable()
export class RepositoryService {
    constructor(
        public readonly userGroupRepository: AccountGroupRepository,
        public readonly userRepository: AccountRepository,
    ) {
    }
}
