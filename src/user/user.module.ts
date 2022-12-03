import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from '../utils';
import { UserController } from './controllers';
import { UserService } from './services';
import { SharedModule } from '../shared';
import { MailerModule } from '../mailer';

@Module({})
export class UserModule {
  static forRoot(envConfig: EnvConfig): DynamicModule {
    return {
      module: UserModule,
      imports: [
        SharedModule,
        MailerModule.forRoot(envConfig),
      ],
      providers: [UserService],
      controllers: [UserController],
      exports: [UserService],
    };
  }
}
