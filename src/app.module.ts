import { DynamicModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApmModule } from './apm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';
import { AllExceptionFilter, AuthenticationGuard, LoggingInterceptor } from './shared';
import { UserModule } from './user/user.module';
import { EnvConfig } from './utils';

export class AppModule {
  static forRoot(envConfig: EnvConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(envConfig),
        DatabaseModule.forRoot(envConfig),
        AuthModule.forRoot(envConfig),
        UserModule.forRoot(envConfig),
        ApmModule.forRoot(envConfig),
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', './static'),
        }),
        ScheduleModule.forRoot(),
      ],
      controllers: [AppController],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: AllExceptionFilter,
        },
        {
          provide: APP_GUARD,
          useClass: AuthenticationGuard,
        },
        AppService,
      ],
    };
  }
}
