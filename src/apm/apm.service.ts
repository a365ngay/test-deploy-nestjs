import { Injectable, Logger } from '@nestjs/common';
// import apm from 'elastic-apm-node';
import { ConfigService } from '../config';

@Injectable()
export class ApmService {
  apm: any;

  constructor(private configService: ConfigService) {
    if (!this.configService.isDevMode) {
      // this.apm = apm.start({
      //   serviceName: this.configService.apmServiceName,
      //   serverUrl: this.configService.apmServerUrl,
      // });
    }
  }

  startTransaction(name: string, type = 'Request') {
    if (!this.configService.isDevMode && this.apm) {
      // this.apm.startTransaction(name, type);
    } else {
      if (this.configService.nodeEnv === 'development') {
        Logger.log('[ApmService:startTransaction] apm service is inactive.');
      }
    }
  }

  endTransaction(result: string) {
    if (!this.configService.isDevMode && this.apm) {
      // this.apm.endTransaction(result);
    } else {
      if (this.configService.nodeEnv === 'development') {
        Logger.log('[ApmService:endTransaction] apm service is inactive.');
      }
    }
  }

  captureError(err: Error) {
    if (!this.configService.isDevMode && this.apm) {
      Logger.error(err.stack);
      // this.apm.captureError(err);
    } else {
      if (this.configService.nodeEnv === 'development') {
        Logger.log('[ApmService:captureError] apm service is inactive.');
      }
    }
  }
}
