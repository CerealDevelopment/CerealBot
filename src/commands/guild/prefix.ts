import { Message } from "discord.js";
import Keyv from "keyv";
import { userPermissions } from "../../models/discordUserPermissions";
import { DATABASE } from "../../../config.json";
import logger from "../../logging";

const getGuildPrefix = async (guildId: string, guildPrefixes: Keyv): Promise<string> => {
  const prefix: string = await guildPrefixes.get(guildId);
  return `Prefix is \`${prefix ?? "!"}\``;
};

const setGuildPrefix = async (guildId: string, guildPrefixes: Keyv, newPrefix: string): Promise<string> => {
  await guildPrefixes.set(guildId, newPrefix);
  return `You changed the prefix to \`${newPrefix}\``;
};

const dispatchPrefixFun = async (message: Message, keyvGuildConfig: Keyv, args: string[]): Promise<string> => {
  let reply: string;

  if (!args.length || args.length === 0) {
    reply = await getGuildPrefix(message.guild.id, keyvGuildConfig);
  } else if (args.length > 1) {
    reply = "You provided too many arguments. The prefix should be exactly one with a length of one. E.g.: `$`";
    throw new Error(reply);
  } else {
    if (args[0].length > 1) {
      reply = "The provided prefix is too long. Make sure it has a length of 1";
      throw new Error(reply);
    } else {
      reply = await setGuildPrefix(message.guild.id, keyvGuildConfig, args[0]);
    }
  }
  return reply;
};

module.exports = {
  name: "prefix",
  description: "Set the prefix for the bot",
  hasArgs: false,
  neededUserPermissions: [userPermissions.administrator, userPermissions.manage_guild],
  usage: "<new Prefix> - has to be a length of 1. Keep in mind to choose a symbol makes using the bot easier.",
  async execute(message: Message, args: string[]) {
    const keyvGuildConfig: Keyv = new Keyv(DATABASE.CONNECTION_STRING, {
      namespace: "guildConfig",
    });
    const reply: string = await dispatchPrefixFun(message, keyvGuildConfig, args).catch(e => {
      logger.error(e);
      return e.message;
    });

    message.reply(reply);
  },
};
