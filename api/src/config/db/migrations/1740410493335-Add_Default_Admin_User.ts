import { createId } from "@paralleldrive/cuid2";
import { hashSync } from "bcrypt";
import { randomUUID } from "crypto";
import { MigrationInterface, QueryRunner } from "typeorm";

const user = {
    id: createId(),
    email: "admin@admin.com",
    password: hashSync("admin", 10),
    external_id: randomUUID(),
    is_admin: true,
};

export class AddDefaultAdminUser1740410493335 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
           INSERT INTO "public"."users" (id, email, password, external_id, is_admin)
           VALUES ('${user.id}', '${user.email}', '${user.password}', '${user.external_id}', ${user.is_admin});
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "public"."users" WHERE email='${user.email}';
        `);
    }
}