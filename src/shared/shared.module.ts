import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { AuthenticationGuard } from './guards/roles.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

import {
  UserRepository
} from './repositories';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [
    passportModule,
    TypeOrmModule.forFeature([
      UserRepository,
    ]),],
  providers: [
    AuthenticationGuard,
    AllExceptionFilter,
    LoggingInterceptor
  ],
  exports: [TypeOrmModule, passportModule, AuthenticationGuard],
})
export class SharedModule { }
