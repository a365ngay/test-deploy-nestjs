import { IsEmail, IsDefined, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { INVALID_EMAIL } from '../../common';

export class ForgotPasswordDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail({}, { message: INVALID_EMAIL })
  @ApiProperty()
  readonly email: string;
}

export class ForgotPasswordPatientDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail({}, { message: INVALID_EMAIL })
  @ApiProperty()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  readonly action: string;
}
