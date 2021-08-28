import { Client, Message } from "discord.js";
import { DISCORD, DATABASE, MEME } from "../config.json";
import { CommandInterface, getCommandMap } from "./utils";
import _ from "lodash";
import { getPrefixSetIfEmpty } from "./data/prefixDataAccess";
import logger from "./logging";
import cron from "node-cron";
import { clearDatabaseAndSyncWithImgur, isMemeDatabaseEmpty } from "./data/memeDataAccess";
import knex from "./data/database";

const client: Client = new Client();
const globalPrefix: string = DISCORD.PREFIX ? DISCORD.PREFIX : "!";

const BOT_TOKEN: string = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : DISCORD.BOT_TOKEN;

// TODO Move also into module or at least move the imgur part into one function e.g. clearAndInitImgur
knex.migrate
  .latest({ directory: DATABASE.PATH_TO_MIGRATION_FILES })
  .then(isMemeDatabaseEmpty)
  .then(isEmpty => {
    if (isEmpty) {
      clearDatabaseAndSyncWithImgur();
    }
  })
  .catch(e => {
    logger.error(e);
    process.exit(1);
  });

client.login(BOT_TOKEN).catch((e: Error) => {
  logger.error(`The 'BOT_TOKEN' is missing.\n${e.stack}`);
  process.exit(1);
});

const checkRights = (message: Message, rights: any): boolean => {
  const user = message.member;
  return user.hasPermission(rights);
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
});

cron.schedule(MEME.SYNC_AT_MIDNIGHT, async () => {
  logger.info("Run meme sync job");
  await clearDatabaseAndSyncWithImgur();
});

client.on("message", async (message: Message) => {
  const prefix: string = await getPrefixSetIfEmpty(message.guild.id, globalPrefix).catch(e => {
    logger.error(e);
  });

  if (!message.content.startsWith(prefix) || message.author.bot) {
    if (_.isEqual(_.trim(message.content.toLocaleLowerCase()), "prefix")) {
      message.reply(`Prefix is '${prefix}'`);
    }
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLocaleLowerCase();
  logger.info(`Called '${command}' by '${message.author.id}' in '${message.guild.id}'`);
  const executedCommand = _.attempt(executeCommand, message, prefix, command, args);

  if (_.isError(executedCommand)) {
    logger.error(executedCommand);
    message.reply(
      `I'm sorry, but your command is unknown. Please type \`${prefix}help\` for a list of all featured commands.`
    );
  }
});
