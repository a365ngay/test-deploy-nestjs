import { IsDate, IsUUID } from 'class-validator';
import sodium from 'libsodium-wrappers-sumo';
import { Check, Column, Entity } from 'typeorm';
import { IRole } from '../interfaces';

@Entity()
@Check(`"role" = 'admin' OR "role" = 'user'`)
export class User {
  @Column({ type: 'uuid', primary: true, default: () => 'gen_random_uuid()' })
  @IsUUID()
  public id!: string;

  @Column({ type: 'character varying', length: 100, nullable: false })
  public username!: string;

  @Column({ type: 'character varying', length: 100, nullable: false })
  public firstname!: string;

  @Column({ type: 'character varying', length: 100, nullable: false })
  public lastname!: string;

  @Column('text')
  public email!: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  public dob!: Date;

  @Column({ type: 'text', nullable: true })
  public phoneNumber!: string;

  @Column({ type: 'text', nullable: true })
  public address!: string;

  @Column('text')
  public password!: string;

  @Column('text')
  public role!: IRole;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @IsDate()
  public lastLoginTime!: Date;

  @Column('text')
  public status!: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @IsDate()
  public createdDate!: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @IsDate()
  public updatedDate!: Date;

  @Column('text')
  public isDelete!: string;

  public toPublicJSON() {
    return {
      id: this.id, 
      username: this.username,
      lastname: this.lastname,
      email: this.email,
      role: this.role,
      firstname: this.firstname,
      lastLoginTime: this.lastLoginTime,
      status: this.status,
      address: this.address,
      phoneNumber: this.phoneNumber,
      dob: this.dob,
    };
  }

  public async verifyPassword(password: string): Promise<boolean> {
    await sodium.ready;
    return await sodium.crypto_pwhash_str_verify(this.password, password);
  }
}
