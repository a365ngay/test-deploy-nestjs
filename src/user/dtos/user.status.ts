import { IsString, IsEmail, IsDefined, IsNotEmpty, IsUUID } from 'class-validator';
import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class StatusUser {
    @IsString()
    @ApiProperty()
    readonly userId: string;

    @IsString()
    @ApiProperty()
    readonly status: string;
}