import { MigrationInterface, QueryRunner } from "typeorm";

export class NewEmail1747077074731 implements MigrationInterface {
    name = 'NewEmail1747077074731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "emailAddress" TO "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "email" TO "emailAddress"`);
    }

}
