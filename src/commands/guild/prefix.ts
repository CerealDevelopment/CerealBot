import { Message } from "discord.js";
import Keyv from "keyv";
import { createError } from "../../utils";
import { userPermissions } from "../../discordUserPermissions";
import { DATABASE } from "../../../config.json";

const getGuildPrefix = async (
  message: Message,
  guildPrefixes: Keyv
): Promise<string> => {
  const guildId: string = message.guild.id;
  const prefix: string = await guildPrefixes.get(guildId);
  return `Prefix is \`${prefix ?? "!"}\``;
};

const setGuildPrefix = async (
  message: Message,
  guildPrefixes: Keyv,
  newPrefix: string
): Promise<string> => {
  const guildId: string = message.guild.id;
  await guildPrefixes.set(guildId, newPrefix);
  return `You changed the prefix to \`${newPrefix}\``;
};

const dispatchPrefixFun = async (
  message: Message,
  keyvGuildConfig: Keyv,
  args: string[]
): Promise<[string, Error]> => {
  let error: Error = null;
  let reply: string;

  if (!args.length) {
    reply = await getGuildPrefix(message, keyvGuildConfig);
  } else if (args.length > 1) {
    reply =
      "You provided too many arguments. The prefix should be exactly one with a length of one. E.g.: `$`";
    error = createError(message, reply);
  } else if (args.length === 1) {
    if (args[0].length > 1) {
      reply = "The provided prefix is too long. Make sure it has a length of 1";
      error = createError(message, reply);
    } else {
      reply = await setGuildPrefix(message, keyvGuildConfig, args[0]);
    }
  }
  return [reply, error];
};

module.exports = {
  name: "prefix",
  description: "Set the prefix for the bot",
  hasArgs: false,
  neededUserPermissions: [
    userPermissions.administrator,
    userPermissions.manage_guild,
  ],
  usage:
    "<new Prefix> - has to be a length of 1. Keep in mind to choose a symbol makes using the bot easier.",
  async execute(message: Message, args: string[]) {
    const keyvGuildConfig: Keyv = new Keyv(DATABASE.CONNECTION_STRING, {
      namespace: "guildConfig",
    });
    const [reply, error] = await dispatchPrefixFun(
      message,
      keyvGuildConfig,
      args
    );

    message.reply(reply);
    return error;
  },
};