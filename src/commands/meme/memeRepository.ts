import { knex } from "knex";
import knexConfig from "../../data/knexfile";
import { MemeResource } from "../../models/meme";
import { MEME } from "../../../config.json";
import logger from "../../logging";
import _ from "lodash";

const config = knexConfig.development;
const db = knex(config);

/**
 * Inserts MemeResources to database
 * @param entries Array with MemeResource objects
 */
const addBatchEntriesToDatabase = async (entries: Array<MemeResource>) => {
  await db(MEME.TABLE_NAME)
    .insert(entries)
    .catch(error => logger.error(error));
};

/**
 * Select a random meme entry from database
 * @returns Random meme
 */
const selectRandomDbEntry = async (): Promise<MemeResource> => {
  const [result] = await db.select("*").from<MemeResource>(MEME.TABLE_NAME).orderByRaw("RANDOM()").limit(1);
  if (_.isEmpty(result)) {
    throw new Error("No entries in Database present.");
  }
  return result;
};

/**
 * Remove all entries in the meme table
 */
const removeAllEntries = async () => {
  await db(MEME.TABLE_NAME)
    .whereNotNull("id")
    .del()
    .catch(error => logger.error(error));
};

/**
 * Count entries in the meme table
 * @returns Number of entries
 */
const countDatabaseEntries = async (): Promise<void | Record<string, number>> => {
  return await db(MEME.TABLE_NAME)
    .count<Record<string, number>>("id")
    .catch(error => {
      logger.error(error);
    });
};

export { addBatchEntriesToDatabase, selectRandomDbEntry, removeAllEntries, countDatabaseEntries };
