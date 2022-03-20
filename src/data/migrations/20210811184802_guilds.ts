import { Knex } from "knex";
import { createPrefixTable } from "../prefixDataAccess";

// We could replace this with just create table.
// I dont think, this is the way for migration.
// These files seem like a one time use thing tbh. We should just create the tables normally i.e. check Schema Builder
// in the docs
export async function up(knex: Knex): Promise<void> {
  return createPrefixTable(knex);
}
