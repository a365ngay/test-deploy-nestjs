import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser, User } from '../common';
import { ConfigService } from '../config';
import { AuthService } from './services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly configService: ConfigService, private readonly service: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.sessionKey,
      algorithms: 'HS512',
    });
  }

  async validate(payload: IUser, done: (err: Error | null, user?: User | boolean) => void) {
    try {
      let user = await this.service.findOneByEmail(payload.email);
        if (!user) {
          return done(new UnauthorizedException('Invalid JWT token'), false);
        }
        return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
}
