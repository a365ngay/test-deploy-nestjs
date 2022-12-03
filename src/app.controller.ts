import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHeartbeat(): string {
    return this.appService.getHeartbeat();
  }
}
