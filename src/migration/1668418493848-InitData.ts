import {MigrationInterface, QueryRunner} from "typeorm";

export class InitData1668418493848 implements MigrationInterface {
    name = 'InitData1668418493848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "username" character varying(100) NOT NULL, "firstname" character varying(100) NOT NULL, "lastname" character varying(100) NOT NULL, "email" text NOT NULL, "dob" TIMESTAMP, "phoneNumber" text, "address" text, "password" text NOT NULL, "role" text NOT NULL, "lastLoginTime" TIMESTAMP, "status" text NOT NULL, "createdDate" TIMESTAMP, "updatedDate" TIMESTAMP, "isDelete" text NOT NULL, CONSTRAINT "CHK_eb2e8c43a592f3f18dc84020f9" CHECK ("role" = 'admin' OR "role" = 'user'), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
