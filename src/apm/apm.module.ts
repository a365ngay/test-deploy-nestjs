import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { EnvConfig } from '../utils';
import { ApmInterceptor } from './apm.interceptor';
import { ApmService } from './apm.service';

@Module({
  providers: [ApmService],
})
export class ApmModule {
  static forRoot(envConfig: EnvConfig): DynamicModule {
    const configModule = ConfigModule.forRoot(envConfig);
    return {
      module: ApmModule,
      imports: [configModule],
      providers: [ApmService, ApmInterceptor],
      exports: [ApmService, ApmInterceptor],
    };
  }
}
