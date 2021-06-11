import {KitchenAccountEntity} from '@kitchen/domain';
import {AuthGuard} from '@nestjs/passport';
import {ExecutionContext, HttpException, HttpStatus, Injectable, SetMetadata} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {RepositoryService} from './repository.service';
import {ConfigService, EREQUIRED_GROUPS} from '../config';

export const RequiredADGroups = (requiredGroups: EREQUIRED_GROUPS) => {
    return SetMetadata(ADGroupsGuard.REQUIRED_GROUPS, requiredGroups);
};

@Injectable()
export class ADGroupsGuard extends AuthGuard('jwt') {
    public static readonly REQUIRED_GROUPS: string = 'REQUIRED_GROUPS';

    constructor(
        private readonly _repo: RepositoryService,
        private readonly _reflector: Reflector,
        private readonly _configService: ConfigService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        const request = context.switchToHttp().getRequest();
        const userModel: KitchenAccountEntity = await this._repo.userRepository.findByLogin(request.user.username);
        if (!userModel) {
            throw new HttpException(`User ${request.user.username} not found`, HttpStatus.BAD_REQUEST);
        }
        const groupsEnum: EREQUIRED_GROUPS = this._reflector.get<EREQUIRED_GROUPS>(ADGroupsGuard.REQUIRED_GROUPS, context.getClass());
        const groups: string[] = this._configService.REQUIRED_GROUPS[groupsEnum];
        if (groups.every(i => !!userModel.groups.find(j => j.name === i))) {
            request.user = userModel;
            return true;
        } else {
            throw new HttpException(`User ${request.user.username} doesn't have required groups: ${groups}`, HttpStatus.FORBIDDEN);
        }
    }
}
