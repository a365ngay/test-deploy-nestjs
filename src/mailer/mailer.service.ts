import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { ConfigService } from '../config';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  async send(m: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo> {
    const { smtpHost: host, smtpPort: port, smtpUser: user, smtpPassword: pass } = this.configService;
    const smtpConfig = {
      host,
      port,
      secure: true,
      auth: {
        user,
        pass,
      },
    };

    const transport =
      this.configService.emailChannel === 'smtp'
        ? nodemailer.createTransport(smtpConfig)
        : nodemailer.createTransport(this.configService.smtpUrl);

    return transport.sendMail(m);
  }
}
