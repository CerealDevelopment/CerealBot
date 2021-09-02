import logger from "../../logging";
import { Message } from "discord.js";
import { getPrefix, setPrefix } from "../../data/prefixDataAccess";
import { userPermissions } from "../../models/discordUserPermissions";
import { DISCORD } from "../../../config.json";

const maxPrefixLength = DISCORD.MAX_PREFIX_LENGTH;

const getGuildPrefix = async (guildId: string): Promise<string> => {
  const prefix: string | void = await getPrefix(guildId).catch(e => {
    logger.error(e);
    return "not set :man_shrugging:";
  });
  return `Prefix is \`${prefix}\``;
};

const setGuildPrefix = async (guildId: string, newPrefix: string): Promise<string> => {
  await setPrefix(guildId, newPrefix);
  return `You changed the prefix to \`${newPrefix}\``;
};

const dispatchPrefixFun = async (guildId: string, args: string[]): Promise<string> => {
  let reply: string;
  const numberOfWords: number = args.length;

  if (!numberOfWords || numberOfWords === 0) {
    reply = await getGuildPrefix(guildId);
  } else if (numberOfWords > 1) {
    reply = "You provided too many arguments. The prefix should be exactly one with a length of one. E.g.: `$`";
    throw new Error(reply);
  } else {
    const potentialPrefix: string = args[0];
    if (potentialPrefix.length > maxPrefixLength) {
      reply = `The provided prefix is too long. Make sure it has a length of at most ${maxPrefixLength}`;
      throw new Error(reply);
    } else {
      reply = await setGuildPrefix(guildId, potentialPrefix);
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
    const reply: string = await dispatchPrefixFun(message.guild.id, args).catch(e => {
      logger.error(e);
      return e.message;
    });

    message.reply(reply);
  },
  dispatchPrefixFun,
};
