import { Client, Message } from "discord.js";
import { DISCORD, DATABASE } from "../config.json";
import { CommandInterface, getCommandMap } from "./utils";
import _ from "lodash";
import Keyv from "keyv";

const client: Client = new Client();
const globalPrefix: string = DISCORD.PREFIX ? DISCORD.PREFIX : "!";

const BOT_TOKEN: string = process.env.BOT_TOKEN
  ? process.env.BOT_TOKEN
  : DISCORD.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.log("The 'BOT_TOKEN' is missing.");
  process.exit(1);
}

try {
  client.login(BOT_TOKEN);
} catch (error) {
  console.log(error);
  process.exit(1);
}

// TODO: Check the admin status
// TODO: add production database driver
const keyvGuildConfig: Keyv = new Keyv(DATABASE.CONNECTION_STRING, {
  namespace: "guildConfig",
});
const executeCommand = (
  message: Message,
  prefix: string,
  command: string,
  args: string[]
) => {
  const executable: CommandInterface = getCommandMap().get(command);
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
  console.log("Time to get cereal!");
});

client.on("message", async (message: Message) => {
  const guildPrefix: string | undefined = await keyvGuildConfig.get(
    message.guild.id
  );
  const prefix: string = guildPrefix ? guildPrefix : globalPrefix;

  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLocaleLowerCase();
  const executedCommand = _.attempt(
    executeCommand,
    message,
    prefix,
    command,
    args
  );

  if (_.isError(executedCommand)) {
    console.error(executedCommand);
    message.reply(
      `I'm sorry, but your command is unknown. Please type \`${prefix}help\` for a list of all featured commands.`
    );
  }
});
