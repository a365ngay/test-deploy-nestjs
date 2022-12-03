import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import fs from 'fs';
import _ from 'lodash';
import mjml from 'mjml';
import path from 'path';
import { User } from '../common';
import { ConfigService } from '../config';
import moment from 'moment';


function renderMjml(filename: string, vars: object): string {
  const headerContent = fs.readFileSync(path.join('templates', '_header.mjml'), 'utf8');
  const footerContent = fs.readFileSync(path.join('templates', '_footer.mjml'), 'utf8');
  const filePath = path.join('templates', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  const finalContent = content
    .replace('<mj-section css-class="header-placeholder"></mj-section>', headerContent)
    .replace('<mj-section css-class="footer-placeholder"></mj-section>', footerContent);

  const mjmlInput = _.template(finalContent)(vars);
  return mjml(mjmlInput, {
    minify: process.env.NODE_ENV === 'production',
    keepComments: process.env.NODE_ENV !== 'production',
    filePath,
  }).html;
}

function sanitizeEmailData(dataStr: string) {
  const regex = /[`<>\{\}\\\/]/gi;
  return dataStr.replace(regex, '');
}
@Injectable()
export class EmailContentService {
  constructor(private readonly configService: ConfigService) { }

  changeUserPasswordEmail(to: string, name: string) {
    const subject = 'Your password changed';
    const url = `${this.configService.frontendUrl}/login`;

    const today = new Date();
    const todayFM = this.DateToYYYYMMDD(today);

    const html = renderMjml('generic-message.mjml', {
      title: 'Your password changed',
      message: `
        <p>Hello ${name}</p>

        <p>Your password for the account ${to} was changed on ${todayFM}</p>
        <p>If this was you, then you can safely ignore this email.</p>
        <p>If this was not you, then your account may have been compromised.  We recommend that you reset your password immediately to regain control of your account.</p>
                
        <p>Thanks,</p>
        <p>Epic Medical Team</p>
        `,
      logoUrl: this.configService.logoUrl,
      terms_condition_url: this.configService.termsConditionUrl,
      contact_us_url: this.configService.contactUsEmail,
      private_policy_url: this.configService.privacyPolicyUrl,
    });

    return {
      from: this.configService.sendgridFromAddress,
      to,
      subject,
      html,
    };
  }

  makeForgotPasswordEmail(data: { id: string; code: string; to: string }) {
    const { id, to, code } = data;
    const suffix = `?time=${+new Date()}`;

    const subject = 'Reset password';
    const url = `${this.configService.frontendUrl}/reset-password/${id}/${code}/${suffix}`;
    const html = renderMjml('generic-message-with-button.mjml', {
      title: 'Reset password',
      message: `
        <p>Hello!</p>
        <p>You are receiving this email because we received a password reset request for your account.</p>
        <p>This password reset link will expire in 60 minutes.</p>
        <p>If you did not request a password reset, no further action is required.</p>
        <p>Thanks,</p>
        <p>Epic Medical Team</p>
        `,
      buttonLabel: 'Reset Password',
      buttonHref: url,
      logoUrl: this.configService.logoUrl,
      terms_condition_url: this.configService.termsConditionUrl,
      contact_us_url: this.configService.contactUsEmail,
      private_policy_url: this.configService.privacyPolicyUrl,
    });
    return {
      from: this.configService.sendgridFromAddress,
      to,
      subject,
      html,
    };
  }

  makePatientCodeRegisterEmail(data: { id: string; code: string; to: string, password: string }) {
    const { to, code, password } = data;
    const subject = 'Freedom Dialysis Verification Code';
    const html = renderMjml('generic-message.mjml', {
      title: 'Freedom Dialysis Verification Code',
      message: `
        <p>Hi,</p>
        <p>Thank you for signing up our Freedom Dialysis App!</p><br/>

        <p>To login use this password: ${password}</p><br/>

        <p>Verification code: ${code.toString()}</p><br/>

        <p>(You are encouraged to change your password after your first login.)</p><br/>

        <p>Yours sincerely,</p>
        <p>Epic Medical</p>
        `,
      logoUrl: this.configService.logoUrl,
      terms_condition_url: this.configService.termsConditionUrl,
      contact_us_url: this.configService.contactUsEmail,
      private_policy_url: this.configService.privacyPolicyUrl,
    });
    return {
      from: this.configService.sendgridFromAddress,
      to,
      subject,
      html,
    };
  }

  makePatientCodeResetPassword(data: { id: string; code: string; to: string; toUser: string }) {
    const { id, to, code, toUser } = data;
    const url = `${this.configService.frontendUrl}/reset-password/patient/${id}/${code}`;
    const subject = 'Freedom Dialysis reset password code';
    const html = renderMjml('generic-message.mjml', {
      title: `Freedom Dialysis Reset Password Code`,
      message: `
        <p>Hi ${toUser},</p>
        <p>We have received a request to reset the password of your account. </p>
        <p>To reset and create a new password, please key in this verification code: ${code.toString()}</p><br/>

        <p>If you did not make this request, get in touch with us right away via the contact us button below.</p><br/>

        <p>Yours sincerely, </p>
        <p>Epic Medical</p>
        `,
      logoUrl: this.configService.logoUrl,
      terms_condition_url: this.configService.termsConditionUrl,
      contact_us_url: this.configService.contactUsEmail,
      private_policy_url: this.configService.privacyPolicyUrl,
    });
    return {
      from: this.configService.sendgridFromAddress,
      to,
      subject,
      html,
    };
  }

  completeResetPasswordEmail(data: { email: string; name: string }) {
    const { email, name } = data;
    const subject = 'Your Epic Medical account password has been changed';
    const today = new Date();
    const todayFM = this.DateToDDMMYYYY(today);

    const html = renderMjml('generic-message.mjml', {
      title: 'Your password has been changed',
      message: `
        <p>Hi ${name}!</p>
        <p>Your password for the account ${email} has been changed on ${todayFM} </p><br/>
        
        <p>If you did not authorize this change, get in touch with us right away via the contact us button below. </p><br/>

        <p>Yours sincerely, </p>
        <p>Epic Medical</p>
        `,
      logoUrl: this.configService.logoUrl,
      terms_condition_url: this.configService.termsConditionUrl,
      contact_us_url: this.configService.contactUsEmail,
      private_policy_url: this.configService.privacyPolicyUrl,
    });

    return {
      from: this.configService.sendgridFromAddress,
      to: email,
      subject,
      html,
    };
  }

  completeCreateUserEmail(userName: string, email: string){
    const subject = 'Invitation to Epic Medical';
    
    const html = renderMjml('generic-message.mjml', {
      title: 'Invitation to Epic Medical',
      message: `
        <p>Hello ${userName}!</p>
        <p>Your account has been created on the Epic Medical system.</p>
        <p>Account login information:</p>
        <p>Username: ${userName}</p>
        <p>Email: ${email}</p>
        <p>Password: Abc@12345</p>
        <p>Thanks,</p>
        <p>Epic Medical Team</p>
        `,
      logoUrl: this.configService.logoUrl,
      terms_condition_url: this.configService.termsConditionUrl,
      contact_us_url: this.configService.contactUsEmail,
      private_policy_url: this.configService.privacyPolicyUrl,
    });

    return {
      from: this.configService.sendgridFromAddress,
      to: email,
      subject,
      html,
    };
  }

  DateToYYYYMMDD(Date: Date): string {
    const DS: string = Date.getFullYear()
      + '/' + ('0' + (Date.getMonth() + 1)).slice(-2)
      + '/' + ('0' + Date.getDate()).slice(-2)
    return DS
  }

  DateToDDMMYYYY(Date: Date): string {
    const DS: string = ('0' + Date.getDate()).slice(-2)
      + '/' + ('0' + (Date.getMonth() + 1)).slice(-2)
      + '/' + Date.getFullYear()
    return DS
  }
}
