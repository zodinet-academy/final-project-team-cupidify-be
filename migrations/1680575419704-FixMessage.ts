import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMessage1680575419704 implements MigrationInterface {
    name = 'FixMessage1680575419704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."message_type_enum" AS ENUM('TEXT', 'IMAGE')`);
        await queryRunner.query(`ALTER TABLE "message" ADD "type" "public"."message_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."message_type_enum"`);
    }

}
