import { Knex } from "knex";
import { MEME } from "../../../config.json";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(MEME.TABLE_NAME, table => {
    table.string("id").primary().notNullable().unique();
    table.string("title").nullable();
    table.string("description").nullable();
    table.string("link").notNullable();
    table.boolean("nsfw").nullable();
    table.string("type").nullable();
    table.dateTime("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {}
