import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfig } from '../utils';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static forRoot(envConfig: EnvConfig): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService(envConfig),
        },
      ],
      exports: [ConfigService],
    };
  }
}
