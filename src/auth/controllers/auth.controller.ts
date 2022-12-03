import {
  Body,
  Controller, Get, HttpCode, HttpException, HttpStatus,
  Post, Put, Query, UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../../common';
import { CurrentUser, Public, Roles } from '../../shared';
import {
  ChangeUserPasswordDTO, CheckForgotPasswordDTO,
  ForgotChangePasswordDTO, ForgotPasswordDTO, LoginSocialPatientDTO, LoginUserDTO
} from '../dtos';
import { AuthService } from '../services';
import { EmailContentService } from './../../mailer/email-content.service';
import { MailerService } from './../../mailer/mailer.service';
import { SuccessResponse } from './../../shared/dtos/success-response.dto';

@Controller('api/auth')
@ApiBearerAuth()
@ApiTags('api/auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly emailContentService: EmailContentService,
  ) { }

  @Post('login')
  @Public()
  async login(@Body() credential: LoginUserDTO) {
    try {
      const accessToken = await this.authService.authenticate(credential);
      return new SuccessResponse(
        {
          accessToken: accessToken,
        },
        'Login Success',
      );
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
        message: err.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDTO) {
    try {
      const emailLower = forgotPassword.email.toLocaleLowerCase();
      const user = await this.authService.findOneByEmail(emailLower, ['forgotPasswords']);
      if (!user) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Invalid email address',
          message: 'Invalid email address',
        }, HttpStatus.NOT_FOUND);
      }
      const code = await this.authService.generateForgotPasswordCode(user);
      const forgotPasswordContent = this.emailContentService.makeForgotPasswordEmail({
        id: user.id,
        code,
        to: forgotPassword.email,
      });
      return await this.mailerService.send(forgotPasswordContent);
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
        message: err.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('change-password')
  @Roles('admin', 'user')
  async changePassword(@Body() dto: ChangeUserPasswordDTO, @CurrentUser() reqUser: User) {
    try {
      await this.authService.changePassword(dto, reqUser);
      return new SuccessResponse({}, 'Success')
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: err.message,
        message: err.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
