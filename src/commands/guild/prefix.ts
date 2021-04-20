import { Message } from "discord.js";
import Keyv from "keyv";

const getGuildPrefix = async (message: Message, guildPrefixes: Keyv): Promise<string> => {
    const guildId: string = message.guild.id;
    const prefix: string = await guildPrefixes.get(guildId);
    return `Prefix is \`${prefix}\``;
};

const setGuildPrefix = async (message: Message, guildPrefixes: Keyv, newPrefix: string): Promise<string> => {
    if (newPrefix.length === 1){
        const guildId: string = message.guild.id;   
        await guildPrefixes.set(guildId, newPrefix);
        return `You changed the prefix to \`${newPrefix}\``;
    }
};

module.exports = {
  name: "prefix",
  description: "Set the prefix for the bot",
  hasArgs: false,
  adminOnly: true,
  usage: "<new Prefix> - has to be a length of 1. Keep in mind to choose a symbol makes using the bot easier.",
  async execute(message: Message, args: string[]) {
      //TODO: add error handling
    const keyvGuildConfig: Keyv = new Keyv('sqlite://database.sqlite', { namespace: "guildConfig" });
    let result: string

    if (!args.length) {
        result = await getGuildPrefix(message, keyvGuildConfig);
    } else if(args.length === 1) {
        result = await setGuildPrefix(message, keyvGuildConfig, args[0]);
    } else if(args.length > 1) {
        result = "You provided too many arguments. The prefix should be exactly one with a length of one. E.g.: \`$\`"
    }
    message.reply(result);
  },
};
