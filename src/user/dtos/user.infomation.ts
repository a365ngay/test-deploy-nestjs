import { IsString, IsEmail, IsDefined, IsNotEmpty, IsUUID } from 'class-validator';
import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class InfomationUser {
    @Column({ type: 'uuid', primary: true, default: () => 'gen_random_uuid()' })
    @IsUUID()
    @ApiProperty()
    public id!: string;

    @IsString()
    @ApiProperty()
    readonly firstname: string;

    @IsString()
    @ApiProperty()
    readonly lastname: string;

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