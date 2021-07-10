import { Client, Message } from "discord.js";
import { DISCORD, DATABASE, MEME } from "../config.json";
import { CommandInterface, getCommandMap } from "./utils";
import _ from "lodash";
import Keyv from "keyv";
import logger from "./logging";
import cron from "node-cron";
import {
  fetchImgurResult,
  removeAllMemeFromDatabase,
  parseMemeResponseToArray,
  addCollectionOfMemesToDatabase,
  isMemeDatabaseEmpty,
} from "./data/memeDataAccess";
import { knex } from "knex";
import knexConfig from "./data/knexfile";

const config = knexConfig.development;
const db = knex(config);
const client: Client = new Client();
const globalPrefix: string = DISCORD.PREFIX ? DISCORD.PREFIX : "!";

const BOT_TOKEN: string = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : DISCORD.BOT_TOKEN;

client.login(BOT_TOKEN).catch((e: Error) => {
  logger.error(`The 'BOT_TOKEN' is missing.\n${e}`);
  process.exit(1);
});

const checkRights = (message: Message, rights): boolean => {
  const user = message.member;
  return user.hasPermission(rights);
};

const keyvGuildConfig: Keyv = new Keyv(DATABASE.CONNECTION_STRING, {
  namespace: "guildConfig",
});

/**
 * Clear database if old entries are available and fill with new memes
 */
const clearDatabaseAndSyncWithImgur = async () => {
  logger.info("Run meme sync job");
  const imgurResults = await fetchImgurResult().then(result => {
    return parseMemeResponseToArray(result);
  });

  if (!_.isEmpty(imgurResults)) {
    removeAllMemeFromDatabase();
    addCollectionOfMemesToDatabase(imgurResults);
  }
};

const executeCommand = (message: Message, prefix: string, command: string, args: string[]) => {
  const executable: CommandInterface = getCommandMap().get(command);
  if (executable !== undefined) {
    if (executable.neededUserPermissions !== undefined) {
      if (executable.neededUserPermissions.length != 0) {
        if (!checkRights(message, executable.neededUserPermissions)) {
          message.channel.send("You are not allowed to run the command");
          throw new Error(`${message.author.id} got an error on '${command}'`);
        }
      }
    }
  }

  if (executable.hasArgs && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (executable.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${executable.name} ${executable.usage}\``;
    }
    message.channel.send(reply);
  } else {
    executable.execute(message, args);
  }
};

client.once("ready", () => {
  logger.info("Time to get cereal!");
  db.migrate
    .latest({ directory: DATABASE.PATH_TO_MIGRATION_FILES })
    .then(isMemeDatabaseEmpty)
    .then(isEmpty => {
      if (isEmpty) {
        clearDatabaseAndSyncWithImgur();
      }
    })
    .catch(e => logger.error(e));
});

cron.schedule(MEME.SYNC_AT_MIDNIGHT, async () => {
  await clearDatabaseAndSyncWithImgur();
});

client.on("message", async (message: Message) => {
  const guildPrefix: string | undefined = await keyvGuildConfig.get(message.guild.id);
  const prefix: string = guildPrefix ? guildPrefix : globalPrefix;

  if (!message.content.startsWith(prefix) || message.author.bot) {
    if (_.isEqual(_.trim(message.content.toLocaleLowerCase()), "prefix")) {
      message.reply(`Prefix is \`${prefix}\``);
    }
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLocaleLowerCase();
  const executedCommand = _.attempt(executeCommand, message, prefix, command, args);

  if (_.isError(executedCommand)) {
    logger.error(executedCommand);
    message.reply(
      `I'm sorry, but your command is unknown. Please type \`${prefix}help\` for a list of all featured commands.`
    );
  }
});
