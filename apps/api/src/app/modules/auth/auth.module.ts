import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {environment} from '../../../environments/environment';
import {ConfigModule, ConfigService} from '../config';
import {LDAPService} from './ldap';
import {AccountGroupRepository, AccountRepository} from './repositories';
import {RepositoryService} from './repository.service';
import {JwtStrategy} from './jwt.strategy';
import {AuthController} from './auth.controller';
import {ADGroupsGuard} from './groups.guard';
import {LoggerModule} from '../logger';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
    imports: [
        passportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.JWT_SECRET,
                signOptions: {
                    expiresIn: environment.production ? '1h' : '7d'
                },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([
            AccountGroupRepository,
            AccountRepository,
        ]),
        LoggerModule,
    ],
    providers: [
        JwtStrategy,
        ADGroupsGuard,
        LDAPService,
        RepositoryService,
    ],
    controllers: [
        AuthController,
    ],
    exports: [
        passportModule,
        LDAPService,
        RepositoryService,
    ],
})
export class AuthModule {
}
