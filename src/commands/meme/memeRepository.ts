import { knex } from "knex";
import knexConfig from "../../data/knexfile";
import { MemeResource } from "../../types";
import { MEME } from "../../../config.json";
import logger from "../../logging";
import _ from "lodash";

const config = knexConfig.development;
const db = knex(config);

/**
 *
 * @param entries
 */
const addBatchEntriesToDatabase = async (entries: Array<MemeResource>) => {
  await db(MEME.TABLE_NAME)
    .insert(entries)
    .catch(error => logger.error(error));
};

/**
 *
 * @returns
 */
const selectRandomDbEntry = async (): Promise<MemeResource> => {
  const [result] = await db.select("*").from<MemeResource>(MEME.TABLE_NAME).orderByRaw("RANDOM()").limit(1);
  if (_.isEmpty(result)) {
    throw new Error("No entries in Database present.");
  }
  return result;
};

/**
 *
 */
const removeAllEntries = async () => {
  await db(MEME.TABLE_NAME)
    .whereNotNull("id")
    .del()
    .catch(error => logger.error(error));
};

/**
 *
 * @returns result
 */
const countDatabaseEntries = async (): Promise<void | Record<string, number>> => {
  // todo Why is this working and not the shorter .catch(error => logger.error(error))?
  return await db(MEME.TABLE_NAME)
    .count<Record<string, number>>("id")
    .catch(error => {
      logger.error(error);
    });
};

export { addBatchEntriesToDatabase, selectRandomDbEntry, removeAllEntries, countDatabaseEntries };
