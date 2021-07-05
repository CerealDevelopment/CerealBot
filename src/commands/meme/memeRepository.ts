import { knex } from "knex";
import knexConfig from "../../data/knexfile";
import { MemeResource } from "../../types";
import { MEME } from "../../../config.json";

const config = knexConfig.development;
const db = knex(config);

/**
 *
 * @param entries
 */
const addBatchEntriesToDatabase = async (entries: Array<MemeResource>) => {
  await db(MEME.TABLE_NAME).insert(entries);
};

/**
 *
 * @returns
 */
const selectRandomDbEntry = async (): Promise<MemeResource> => {
  const [result] = await db.select("*").from<MemeResource>(MEME.TABLE_NAME).orderByRaw("RANDOM()").limit(1);
  return result;
};

/**
 *
 */
const removeAllEntries = async () => {
  await db(MEME.TABLE_NAME).whereNotNull("id").del();
};

/**
 *
 * @returns result
 */
const countDatabaseEntries = async (): Promise<Record<string, number>> => {
  return await db(MEME.TABLE_NAME).count<Record<string, number>>("id");
};

export { addBatchEntriesToDatabase, selectRandomDbEntry, removeAllEntries, countDatabaseEntries };
