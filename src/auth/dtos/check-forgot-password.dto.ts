import { IsString, IsDefined, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckForgotPasswordDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly id: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly code: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly time: string;
}
