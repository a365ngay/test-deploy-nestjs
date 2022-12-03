import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { IRole } from '../../common';
import { DatabaseModule } from '../../database';
import { validateInput } from '../../utils';
import { AuthModule } from '../auth.module';
import { ParseRolePipe } from './parse-role.pipe';

describe('ParseRolePipe', () => {
  let connection: Connection;
  let module: TestingModule;

  beforeEach(async () => {
    const envConfig = validateInput();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forRoot(envConfig), AuthModule.forRoot(envConfig)],
    }).compile();

    connection = module.get<Connection>(Connection);
  });

  afterEach(() => {
    if (connection.isConnected) {
      connection.close();
    }
  });

  it('should be defined', () => {
    expect(new ParseRolePipe()).toBeDefined();
  });

  it('should throw exception if role is missing', async () => {
    const pipe = new ParseRolePipe();
    try {
      await pipe.transform(null, { type: 'param' });
    } catch (err) {
      expect(err instanceof BadRequestException).toBeTruthy();
      const errRes = (err as BadRequestException).getResponse() as { message: string };
      expect(errRes.message).toEqual('Roles are missing.');
    }
  });

  it('should throw exception if role is not valid', async () => {
    const pipe = new ParseRolePipe();
    try {
      await pipe.transform(['bad role'], { type: 'param' });
    } catch (err) {
      expect(err instanceof BadRequestException).toBeTruthy();
      const errRes = (err as BadRequestException).getResponse() as { message: string };
      expect(errRes.message).toEqual(`bad role is not a valid role.`);
    }
  });

  it('should return IRole array', async () => {
    const pipe = new ParseRolePipe();
    const result = await pipe.transform('admin', { type: 'param' });
    expect(result).toEqual(['admin' as IRole]);

    const result2 = await pipe.transform('user', { type: 'param' });
    expect(result2).toEqual(['user' as IRole]);

    const result3 = await pipe.transform(['admin', 'user'], { type: 'param' });
    expect(result3).toEqual(['admin' as IRole, 'user' as IRole]);
  });
});
