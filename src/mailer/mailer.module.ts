import { SharedModule } from './../shared/shared.module';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { EnvConfig } from '../utils';
import { EmailContentService } from './email-content.service';
import { MailerService } from './mailer.service';

@Module({})
export class MailerModule {
  static forRoot(envConfig: EnvConfig): DynamicModule {
    const configModule = ConfigModule.forRoot(envConfig);
    return {
      module: MailerModule,
      imports: [configModule, SharedModule],
      providers: [EmailContentService, MailerService ],
      exports: [configModule, EmailContentService, MailerService],
    };
  }
}
