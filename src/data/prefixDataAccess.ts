import { Knex } from "knex";
import knex from "./database";
import { DISCORD } from "../../config.json";
import logger from "../logging";
import _ from "lodash";

const guildTableName = "guild";
const maxPrefixLength = DISCORD.MAX_PREFIX_LENGTH;

/**
 * Sets new Prefix for a guild
 * @param guildId - The id of the guild
 * @param newPrefix - The new prefix
 * @param prefixMaxLength - The maximum length of the prefix
 * @returns - A promise, that writes to the database
 */
const setPrefix = async (guildId: string, newPrefix: string, prefixMaxLength: number = maxPrefixLength): Promise<any> => {
  if (newPrefix.length > prefixMaxLength)
    throw Error(
      `Prefix is too long. It should have at most a length of ${prefixMaxLength}, but has a length of ${newPrefix.length}`
    );

  return knex(guildTableName)
    .insert({
      id: guildId,
      prefix: newPrefix,
    })
    .onConflict("id")
    .merge();
};

/**
 * Get prefix of guild
 * @param guildId - The ID of the guild
 * @returns - A promise, that accesses the database and returns the prefix as a string
 */
const getPrefix = async (guildId: string): Promise<string> => {
  return knex(guildTableName)
    .where({ id: guildId })
    .first("prefix")
    .then(row => {
      const { prefix } = row;
      return prefix;
    });
};

const getPrefixSetIfEmpty = async (guildId: string, newPrefix: string): Promise<any> => {
  const res = await getPrefix(guildId).catch(_ => {
    logger.info(`Guild Prefix for '${guildId}' was not found.`);
    setPrefix(guildId, newPrefix);
    return getPrefix(guildId);
  });
  return res;
};

/**
 * Creates the prefix table
 */
const createPrefixTable = async (knex: Knex): Promise<void> => {
  return knex.schema
    .createTable(guildTableName, table => {
      table.string("id").primary().notNullable().unique();
      table.string("prefix", maxPrefixLength).defaultTo(DISCORD.PREFIX);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .catch(e => {
      logger.error(e);
    });
};

export { setPrefix, getPrefix, getPrefixSetIfEmpty, createPrefixTable };
