import { IsDefined, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ChangePasswordError, PASSWORD_PATTERN } from '../error-messages';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserPasswordDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly currentPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: `New ${ChangePasswordError.PATTERN}` })
  @ApiProperty()
  readonly newPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: `Confirm ${ChangePasswordError.PATTERN}` })
  @ApiProperty()
  readonly confirmPassword: string;
}
