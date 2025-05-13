import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities1747148088251 implements MigrationInterface {
    name = 'UpdateEntities1747148088251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_a4f3cb1b950608959ba75e8df36"`);
        await queryRunner.query(`CREATE TABLE "membership_type" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "price" double precision NOT NULL, CONSTRAINT "PK_5c09e5b961e10506b61cf12c9f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wash_type" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "price" double precision NOT NULL, CONSTRAINT "PK_796117a09b60b0aaf9bb115a2db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "y"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "maxWheelWidth" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "height" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "selfWashes" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "washHalls" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "openTo" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "openFrom" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "imageUrl" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "carId" integer`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "locationId" integer`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "membershipTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "wash" ADD "washTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_07b69be06d017dc96ef5ef71adf" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_75fc8ef0b7b43e0f48d50048db7" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_d35d3cff47b33ba16b0ad4636b6" FOREIGN KEY ("membershipTypeId") REFERENCES "membership_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wash" ADD CONSTRAINT "FK_e91d07ffbaa9483ba0dd3f2eb76" FOREIGN KEY ("washTypeId") REFERENCES "wash_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wash" DROP CONSTRAINT "FK_e91d07ffbaa9483ba0dd3f2eb76"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_d35d3cff47b33ba16b0ad4636b6"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_75fc8ef0b7b43e0f48d50048db7"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_07b69be06d017dc96ef5ef71adf"`);
        await queryRunner.query(`ALTER TABLE "wash" DROP COLUMN "washTypeId"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "membershipTypeId"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "locationId"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP COLUMN "carId"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "openFrom"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "openTo"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "washHalls"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "selfWashes"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "maxWheelWidth"`);
        await queryRunner.query(`ALTER TABLE "membership" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "location" ADD "y" double precision NOT NULL`);
        await queryRunner.query(`DROP TABLE "wash_type"`);
        await queryRunner.query(`DROP TABLE "membership_type"`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_a4f3cb1b950608959ba75e8df36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
