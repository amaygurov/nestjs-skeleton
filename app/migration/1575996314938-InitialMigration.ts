import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1575996314938 implements MigrationInterface {
    name = 'InitialMigration1575996314938'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "public"."photo" ("id" SERIAL NOT NULL, "content" bytea NOT NULL, "recognitionData" json, CONSTRAINT "PK_006f41e65eb5601b7e7338e47d5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin')`, undefined);
        await queryRunner.query(`CREATE TABLE "public"."user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_b67337b7f8aa8406e936c2ff754" UNIQUE ("username"), CONSTRAINT "PK_03b91d2b8321aa7ba32257dc321" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "public"."user"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."photo"`, undefined);
    }

}
