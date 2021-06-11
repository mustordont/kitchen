import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '../config';

export interface IJWTPayload {
    username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private _configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            ignoreExpiration: false,
            secretOrKey: _configService.JWT_SECRET,
        });
    }

    async validate(payload: IJWTPayload) {
        return {username: payload.username};
    }
}
