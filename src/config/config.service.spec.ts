import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { validateInput } from '../utils/validateVariables';

describe('ConfigServiceService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useFactory: () => {
            const envConfig = validateInput();
            return new ConfigService(envConfig);
          },
        },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should default NODE_ENV to test', () => {
    expect(service.nodeEnv).toEqual('test');
  });

  it('should have port 3000', () => {
    expect(service.port).toEqual(3000);
  });

  it('should have session key', () => {
    expect(service.sessionKey).toEqual(
      'cbd3f46c2644ba8e4a7e12ec81c38e48fe6daa8f6ad2d7ffc3466e9b1282a8317649bcbed5e69951c3253998ba571959ab0de9e5dce8445c64859c1cd2e97531',
    );
  });

  it('should have send mail configurations', () => {
    expect(service.emailChannel).toEqual('test');
    expect(service.smtpUrl).toEqual('smtp://mailhog:1025');
    expect(service.sendgridFromAddress).toEqual('questionnaire-frontend@diginex.fun');
    expect(service.smtpHost).toEqual('');
    expect(service.smtpPort).toEqual(465);
    expect(service.smtpUser).toEqual('');
    expect(service.smtpPassword).toEqual('');
  });

  it('frontend url should be http://localhost:4200', () => {
    expect(service.frontendUrl).toEqual('http://localhost:4200');
  });

  it('valid period in hour should be 1', () => {
    expect(service.validPeriodInHour).toEqual(1);
  });
});
