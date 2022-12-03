import { IsString, IsEmail, IsDefined, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUser {
    @IsString()
    @ApiProperty()
    readonly firstname: string;

    @IsString()
    @ApiProperty()
    readonly lastname: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly username: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: 'Must be a valid email' })
    @ApiProperty()
    readonly email: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly dob: string

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly genderId: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly phoneNumber: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly countryId: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly address: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly educationId: string;
}