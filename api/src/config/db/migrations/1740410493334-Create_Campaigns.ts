import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCampaigns1740410493334 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "public"."campaigns" (
                id varchar(255) PRIMARY KEY,
                name varchar(255) NOT NULL,
                external_id varchar(255) NOT NULL,
                deleted boolean NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "public"."campaigns";
        `);
    }
}