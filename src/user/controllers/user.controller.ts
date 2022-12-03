import {
    Body, Controller, Get, HttpException, HttpStatus, Post, Put, Query, UseGuards, UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Connection } from 'typeorm';
import { User } from '../../common';
import {
    AuthenticationGuard,
    CurrentUser, OrderBy,
    OrderByPipe,
    PageIndexPipe,
    PageLimitPipe, Roles
} from '../../shared';
import { InfomationUser, RegisterUser } from '../dtos';
import { UserService } from '../services';


@UseGuards(AuthenticationGuard)
@ApiBearerAuth('JWT-auth')
@Controller('api/user')
@ApiTags('api/user')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
    constructor(
        private connection: Connection,
        private readonly userService: UserService,
    ) { }

    @Post('create-user')
    @Roles('admin')
    async createUser(@Body() user: RegisterUser) {
        try {
            return await this.userService.createUser(user);
        } catch (err) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: err.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Put('update-user')
    @Roles('admin', 'user')
    async updateUser(@Body() user: InfomationUser) {
        try {
            return await this.userService.updateUser(user);
        } catch (err) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: err.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('get-list-nurse')
    @Roles('admin', 'user')
    async getListNurse(@CurrentUser() reqUser: User) {
        try {
            return await this.userService.getListNurse(reqUser)
        } catch (err) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: err.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('get-all-nurse')
    @Roles('admin')
    async getAllNurse(
        @Query('page', PageIndexPipe) page: number,
        @Query('limit', PageLimitPipe) limit: number,
        @Query('filter') filter?: string,
        @Query('orderBy', OrderByPipe) orderBy?: OrderBy,
    ) {
        try {
            return await this.userService.getAllNurse({ page, limit }, filter, orderBy)
        } catch (err) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: err.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }
}