import { Migration } from '@mikro-orm/migrations';

export class Migration20250726215506 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "shop" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shop_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shop_deleted_at" ON "shop" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "shop" cascade;`);
  }

}
