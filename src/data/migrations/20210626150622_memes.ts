import { Knex } from "knex";
import { MEME } from "../../../config.json";

export async function up(knex: Knex): Promise<void> {
  knex.schema.hasTable(MEME.TABLE_NAME).then(function (exists) {
    if (!exists) {
      return knex.schema.createTable(MEME.TABLE_NAME, table => {
        table.string("id").primary().notNullable().unique();
        table.string("title").nullable();
        table.string("description").nullable();
        table.string("link").notNullable();
        table.boolean("nsfw").nullable();
        table.string("type").nullable();
        table.dateTime("created_at");
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {}
