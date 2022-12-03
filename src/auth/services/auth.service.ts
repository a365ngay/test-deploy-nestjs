import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
} from '../../common';
import { LoginUserDTO, ValidateRegister, ForgotChangePasswordDTO, ChangeUserPasswordDTO, ValidateRegisterApp, RegisterAppDTO, LoginPatientAppDTO, LoginSocialPatientDTO } from '../dtos';
import { ChangePasswordError, MIN_PASSWORD_LEN, PASSWORD_PATTERN } from '../error-messages';
import {
  UserRepository,
} from '../../shared';
import sodium from 'libsodium-wrappers-sumo';
import { EmailContentService, MailerService } from '../../mailer';
import { Crypto } from '@peculiar/webcrypto';
import { isEmpty } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private static isEmpty(value: string) {
    return typeof value === 'undefined' || value === null || value === '';
  }
  constructor(
    private mailerService: MailerService,
    private emailContentService: EmailContentService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) { }

  async findOneById(id: string, relations: string[] = []) {
    if (relations.length > 0) {
      return await this.userRepository.findOne({where: {id: id}});
    }
    return await this.userRepository.findOne({where: {id: id}});
  }

  async findOneByOnlyEmailOrUser(email: string) {
    const iomEmailSql = this.userRepository
      .createQueryBuilder('user')
      .where(`LOWER(user.email) = LOWER(:email) AND user.isDelete = '0'`, { email })
      .getOne();

    let [user] = await Promise.all([iomEmailSql]);
    if (user == null) {
      const iomUserSql = this.userRepository
        .createQueryBuilder('user')
        .where(`LOWER(user.username) = LOWER(:email) AND user.isDelete = '0'`, { email })
        .getOne();

      [user] = await Promise.all([iomUserSql]);
    }
    return user;
  }

  async findOneByEmail(email: string, relations: string[] = []) {
    const user = await this.userRepository.findOne({
      where: { email: email, isDelete: '0', status: '1' },
      relations,
    });
    return user;
  }

  async authenticate(loginUser: LoginUserDTO) {
    const { email, password } = loginUser;
    const emailLower = email.toLocaleLowerCase();
    const user = await this.findOneByOnlyEmailOrUser(emailLower);
    if (!user) {
      throw new Error('User is not authenticated');
    } else if (user != null && user.status == '0') {
      throw new Error('This account has been deactivated');
    }

    if (await user.verifyPassword(password)) {
      user.lastLoginTime = new Date(Date.now());
      const updatedUser = await this.userRepository.save(user);
      return this.jwtService.sign(updatedUser.toPublicJSON());
    } else {
      throw new Error('Incorrect password.');
    }
  }

  async generateForgotPasswordCode(user) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    const crypt = new Crypto();
    if (crypt && crypt.getRandomValues) {
      const valuesStr = new Uint32Array(7);
      crypt.getRandomValues(valuesStr);
      for (let i = 0; i < 7; i++) {
        code += alphabet[valuesStr[i] % alphabet.length];
      }
    }
    const forgotPasswords = user.forgotPasswords;
    forgotPasswords.push({
      code,
    });
    user.forgotPasswords = forgotPasswords;
    this.userRepository.save(user);
    return code;
  }


  private async hashPassword(password: string): Promise<string> {
    await sodium.ready;
    return sodium.crypto_pwhash_str(
      password,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    );
  }

  async changePassword(dto: ChangeUserPasswordDTO, reqUser: User) {
    const { currentPassword, newPassword, confirmPassword } = dto;

    if (newPassword.length < MIN_PASSWORD_LEN || !newPassword.match(PASSWORD_PATTERN)) {
      throw new Error(ChangePasswordError.PATTERN);
    }

    if (newPassword !== confirmPassword) {
      throw new Error(ChangePasswordError.MISMATCH_CONFIRM_PASSWORD);
    }

    if (!(await reqUser.verifyPassword(currentPassword))) {
      throw new Error(ChangePasswordError.INCORRECT_PASSWORD);
    }

    if (await reqUser.verifyPassword(newPassword)) {
      throw new Error(ChangePasswordError.REUSE_PASSWORD);
    }

    const { id: userId, email } = reqUser;
    await this.updatePassword(userId, newPassword);

    const content = await this.emailContentService.changeUserPasswordEmail(email, reqUser.username);
    await this.mailerService.send(content);
  }

  async updatePassword(id: string, password: string) { 
    const user = await this.userRepository.findOne({where: {id: id}});
    if (!user) {
      throw new Error('User does not exist, password cannot be updated.');
    }

    user.password = await this.hashPassword(password);
    await this.userRepository.save(user);
  }
}
