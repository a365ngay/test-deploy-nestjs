import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { INVALID_EMAIL } from '../../common';

export class LoginUserDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Invalid login' })
  @ApiProperty()
  public password: string;
}

export class LoginPatientAppDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public email: string;

  @IsDefined()
  @IsString()
  @ApiProperty()
  public password: string;
}

export class ValidateRegister {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail({}, { message: INVALID_EMAIL })
  @ApiProperty()
  readonly email: string;
}

export class ValidateRegisterApp {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail({}, { message: INVALID_EMAIL })
  @ApiProperty()
  readonly email: string;
}

export class RegisterAppDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public email: string;

  @IsDefined()
  @IsString()
  @ApiProperty()
  public password: string;
}

export class LoginSocialPatientDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public accessToken: string;

  @IsDefined()
  @IsString()
  @ApiProperty()
  public social: string;

  @IsDefined()
  @IsOptional()
  @ApiProperty()
  public idSocial: string;
}