import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747391030190 implements MigrationInterface {
    name = 'Migrations1747391030190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "y" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "openTo"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "openTo" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "openFrom"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "openFrom" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "openFrom"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "openFrom" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "openTo"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "openTo" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "y"`);
    }

}
