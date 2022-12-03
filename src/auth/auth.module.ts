import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config';
import {
  User,
} from '../common';

import { SharedModule } from '../shared';
import { EnvConfig } from '../utils';
import { AuthController } from './controllers';
import { JwtStrategy } from './jwt.strategy';
import { ParseRolePipe } from './pipes';
import {
  AuthService,
} from './services';
import { MailerModule } from '../mailer';

@Module({})
export class AuthModule {
  static forRoot(envConfig: EnvConfig): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        SharedModule,
        JwtModule.register({
          secret: envConfig.SESSION_KEY,
          signOptions: {
            expiresIn: '1d',
            algorithm: 'HS512',
          },
        }),
        TypeOrmModule.forFeature([
          User, 
        ]),
        MailerModule.forRoot(envConfig),
        ConfigModule.forRoot(envConfig)
      ],
      providers: [
        AuthService,
        JwtStrategy,
        ParseRolePipe,
      ],
      controllers: [AuthController],
      exports: [AuthService],
    };
  }
}
