import { MigrationInterface, QueryRunner } from "typeorm";

export class Usertable1746548619559 implements MigrationInterface {
    name = 'Usertable1746548619559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
