import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import sodium from 'libsodium-wrappers-sumo';
import { Not } from 'typeorm';
import { User } from '../../common';
import { EmailContentService, MailerService } from '../../mailer';
import { DEFAULT_PAGE_LIMIT, OrderBy, UserRepository } from '../../shared';
import { InfomationUser, RegisterUser, StatusUser } from '../dtos';

@Injectable()
export class UserService {
    private static isEmpty(value: string) {
        return typeof value === 'undefined' || value === null || value === '';
    }

    constructor(
        private emailContentService: EmailContentService,
        private mailerService: MailerService,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) { }

    async findOneById(id: string, relations: string[] = []) {
        return await this.userRepository.findOne({where: {id: id}});
    }

    async getAllNurse(options,
        filter?: string,
        orderBy?: OrderBy) {
        const { page: origPage, limit: origLimit } = options;

        const page = origPage < 0 ? 0 : origPage;
        const limit = origLimit < 0 ? DEFAULT_PAGE_LIMIT : origLimit;

        let condition = `1 = 1 AND user.isDelete = '0' AND user.role = 'user' `;
        if (filter) {
            condition += ` AND
              (
                LOWER(user.email) LIKE '%' || LOWER(:filter) || '%' 
                OR LOWER(user.username) LIKE '%' || LOWER(:filter) || '%' 
              ) `;
        }

        const { orderByField, orderByDirection } = this.getUserOrderByCondition(orderBy);

        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.gender', 'gender')
            .leftJoinAndSelect('user.country', 'country')
            .leftJoinAndSelect('user.education', 'education')
            .andWhere(condition, { filter })
            .orderBy(orderByField, orderByDirection)
            .skip(page * limit)
            .take(limit);

        const [entities, userCount] = await query.getManyAndCount();
        const users = entities.map(u => u.toPublicJSON());

        return {
            users,
            userCount,
        };
    }

    async getListNurse(reqUser: User) {
        if(reqUser.role == 'user'){
          const query = this.userRepository
          .createQueryBuilder('user')
          .where(`1=1 AND user.isDelete = '0' AND user.status = '1' AND user.id = '${reqUser.id}'`)
          let [entities] = await query.getManyAndCount();
          const nurses = entities.map(u => u.toPublicJSON());
          return nurses;
        }
        else {
            const query = this.userRepository
            .createQueryBuilder('user')
            .where(`1=1 AND user.isDelete = '0' AND user.status = '1'`)
            let [entities] = await query.getManyAndCount();
            const nurses = entities.map(u => u.toPublicJSON());
            return nurses;
        }
    }

    async getListNurseContainer(reqUser: User) {
        if(reqUser.role == 'user'){
            const query = await this.userRepository.getListNurseContainer(reqUser.id);
            if(query && query.length > 0){
                return query;
            }
        }
        else {
            const query = await this.userRepository.getListNurseContainer('');
            if(query && query.length > 0){
                return query;
            }
        }
        return null;
    }

    async getUser(reqUser: User){
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.gender', 'gender')
            .leftJoinAndSelect('user.country', 'country')
            .leftJoinAndSelect('user.education', 'education')
            .where(`1=1 AND user.id = '${reqUser.id}'`);

        const user = await query.getOne();
        return user;
    }

    async createUser(dto: RegisterUser) {
        const { username, firstname, lastname, email, dob, genderId, phoneNumber, countryId, address, educationId } = dto;
        const password = "Abc@12345";
        var existedUser = await this.userRepository.findOne({
            where: { email: email, isDelete: '0' },
        });
        if (existedUser) {
            throw new Error(email + ' has already been added to EpicMedical.');
        }
        else {
            existedUser = await this.userRepository.findOne({
                where: { username: username, isDelete: '0' },
            });
            if (existedUser) {
                throw new Error(username + ' has already been added to EpicMedical.');
            }
        }
        const user = new User();
        user.username = username;
        user.firstname = firstname ?? '';
        user.lastname = lastname ?? '';
        user.email = email;
        if(dob != null && dob != ''){
            user.dob = new Date(dob);
        }
        user.phoneNumber = phoneNumber;
        user.address = address;
        user.role = 'user';
        user.password = await this.hashPassword(password);
        user.lastLoginTime = null;
        user.createdDate = new Date(Date.now());
        user.status = '1';
        user.isDelete = '0';
        const newUser = await this.userRepository.save(user);
        const content = await this.emailContentService.completeCreateUserEmail(username, email);
        await this.mailerService.send(content);
        return newUser;
    }

    async updateUser(dto: InfomationUser) {
        const { id, firstname, lastname, email, dob, genderId, phoneNumber, countryId, address, educationId } = dto;
        const existedUser = await this.userRepository.findOne({
            where: { id: id, isDelete: '0' },
        });
        if (!existedUser) {
            throw new BadRequestException('User was not found.');
        }
        existedUser.firstname = firstname ?? '';
        existedUser.lastname = lastname ?? '';
        existedUser.email = email;
        if(dob != null && dob != ''){
            existedUser.dob = new Date(dob);
        }
        else {
            existedUser.dob = null;
        }
        existedUser.phoneNumber = phoneNumber;
        existedUser.address = address;
        existedUser.role = 'user';
        existedUser.updatedDate = new Date(Date.now());
        if (existedUser.email) {
            const isUniqueEmail = await this.isEmailUnique(existedUser.email, dto.id);
            if (!isUniqueEmail) {
                throw new BadRequestException('This email address is already exists');
            }
        }
        return this.userRepository.save(existedUser);
    }

    async delete(userId: string) {
        const user = await this.userRepository.findOne({where: {id: userId}})
        if (user) {
            user.isDelete = '1';
            user.updatedDate = new Date(Date.now());
            return await this.userRepository.save(user);
        }
        return null;
    }

    async isEmailUnique(email: string, id?: any) {
        if (!email) {
            return false;
        }
        const condition = {
            email: email,
            id: Not(id),
            isDelete: '0'
        };
        return await this.userRepository.count({ where: condition }) === 0;
    }

    async hashPassword(password: string): Promise<string> {
        await sodium.ready;
        return sodium.crypto_pwhash_str(
            password,
            sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
            sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        );
    }

    private getUserOrderByCondition(orderBy: OrderBy): { orderByField: string; orderByDirection: 'ASC' | 'DESC' } {
        if (!orderBy) {
            return { orderByField: 'user.username', orderByDirection: 'ASC' };
        }
        let field = 'user.username';
        const direction = orderBy.direction || 'ASC';
        switch (orderBy.field) {
            case 'username':
                field = 'user.username';
                break;
            case 'firstname':
                field = 'user.firstname';
                break;
            case 'lastname':
                field = 'user.lastname';
                break;
            case 'email':
                field = 'user.email';
                break;
            case 'lastLoginTime':
                field = 'user.lastLoginTime';
                break;
            case 'status':
                field = 'user.status';
                break;
            default:
                break;
        }
        return { orderByField: field, orderByDirection: direction };
    }

    async isOnlyEmailUnique(email: string) {
        if (UserService.isEmpty(email)) {
            throw new Error('Iom or Sha email cannot be blank.');
        }

        const iomUserSql = this.userRepository
            .createQueryBuilder('user')
            .where(`LOWER(user.email) = LOWER(:email) AND user.isDelete = '0'`, { email })
            .getCount();

        const [numUserCount] = await Promise.all([iomUserSql]);
        return numUserCount === 0;
    }

    async isOnlyUsernameUnique(username: string) {
        if (UserService.isEmpty(username)) {
            throw new Error('Iom or Sha username cannot be blank.');
        }

        const iomUserSql = this.userRepository
            .createQueryBuilder('user')
            .where(`LOWER(user.username) = LOWER(:username) AND user.isDelete = '0'`, { username })
            .getCount();

        const [numUserCount] = await Promise.all([iomUserSql]);
        return numUserCount === 0;
    }
}