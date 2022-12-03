import { IsString, IsDefined, IsNotEmpty, Matches } from 'class-validator';
import { CheckForgotPasswordDTO } from './check-forgot-password.dto';
import { ChangePasswordError, PASSWORD_PATTERN } from '../error-messages';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotChangePasswordDTO extends CheckForgotPasswordDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: `New ${ChangePasswordError.PATTERN}` })
  @ApiProperty()
  readonly newPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: `New ${ChangePasswordError.PATTERN}` })
  @ApiProperty()
  readonly confirmNewPassword: string;
}
