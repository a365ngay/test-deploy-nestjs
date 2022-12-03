import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities';
import { EnvConfig } from '../utils/validateVariables';

export function getOrmConfig(envConfig: EnvConfig) {
  return {
    type: envConfig.TYPEORM_DRIVER,
    host: envConfig.TYPEORM_HOST,
    port: envConfig.TYPEORM_PORT,
    username: envConfig.TYPEORM_USERNAME,
    password: envConfig.TYPEORM_PASSWORD,
    database: envConfig.TYPEORM_DATABASE,
    synchronize: envConfig.TYPEORM_SYNCHRONIZE,
    logging: envConfig.TYPEORM_LOGGING,
    entities: [__dirname + '/../../dist/**/*.entity.js'],
  };
}

@Module({})
export class DatabaseModule {
  static forRoot(envConfig: EnvConfig) {
    const ormConfig = getOrmConfig(envConfig);
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          ...ormConfig,
          entities: [
            User,
          ],
        }),
      ],
    };
  }
}
