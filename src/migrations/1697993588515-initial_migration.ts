import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1697993588515 implements MigrationInterface {
  name = 'InitialMigration1697993588515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("pkid" SERIAL NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL DEFAULT '1', "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstname" character varying(250) NOT NULL, "lastname" character varying(250) NOT NULL, "middlename" character varying(250), "phone" character varying(20), "email" character varying(250) NOT NULL, "password" character varying(250) NOT NULL, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433" UNIQUE ("id"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_19ad66d3f7250b74880458f4eb9" PRIMARY KEY ("pkid"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a3ffb1c0c8416b9fc6f907b743" ON "users" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_email_index" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_phone_index" ON "users" ("phone") `,
    );
    await queryRunner.query(
      `CREATE TABLE "wallets" ("pkid" SERIAL NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL DEFAULT '1', "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pin" character varying(250) NOT NULL, "active" boolean NOT NULL DEFAULT true, "balance" numeric(10,2) NOT NULL DEFAULT '0', "userPkid" integer NOT NULL, CONSTRAINT "UQ_8402e5df5a30a229380e83e4f7e" UNIQUE ("id"), CONSTRAINT "REL_ef52943abf0e6d32950f7af76d" UNIQUE ("userPkid"), CONSTRAINT "PK_b6aca3b2aad40cfadc55a959921" PRIMARY KEY ("pkid"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8402e5df5a30a229380e83e4f7" ON "wallets" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "wallet_userPkid_index" ON "wallets" ("userPkid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("pkid" SERIAL NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" integer NOT NULL DEFAULT '1', "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying(50) NOT NULL, "amount" numeric(10,2) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Pending', "walletPkid" integer NOT NULL, CONSTRAINT "UQ_a219afd8dd77ed80f5a862f1db9" UNIQUE ("id"), CONSTRAINT "PK_2a5d01d3f81d41b9b01a0017021" PRIMARY KEY ("pkid"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a219afd8dd77ed80f5a862f1db" ON "transactions" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "transaction_walletPkid_index" ON "transactions" ("walletPkid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_ef52943abf0e6d32950f7af76d7" FOREIGN KEY ("userPkid") REFERENCES "users"("pkid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_026a4bb7a910cbc4d8e704a0200" FOREIGN KEY ("walletPkid") REFERENCES "wallets"("pkid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_026a4bb7a910cbc4d8e704a0200"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_ef52943abf0e6d32950f7af76d7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."transaction_walletPkid_index"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a219afd8dd77ed80f5a862f1db"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP INDEX "public"."wallet_userPkid_index"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8402e5df5a30a229380e83e4f7"`,
    );
    await queryRunner.query(`DROP TABLE "wallets"`);
    await queryRunner.query(`DROP INDEX "public"."user_phone_index"`);
    await queryRunner.query(`DROP INDEX "public"."user_email_index"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a3ffb1c0c8416b9fc6f907b743"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
