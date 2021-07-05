import { Knex } from "knex";
import { MEME } from "../../../config.json";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(MEME.TABLE_NAME, table => {
    table.dateTime("creationDate").notNullable().defaultTo(new Date());
  });
}

export async function down(knex: Knex): Promise<void> {}
