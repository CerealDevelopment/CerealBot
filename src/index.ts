import { Client, Collection, Message  } from "discord.js";
import config from "../config.json";
import utils from "./utils";

const client: Client = new Client();
const prefix: string = config.PREFIX;
const commands: Collection<string, CommandInterface> = new Collection();
const commandFiles: Array<string> = utils.findFilesWithEnding(
  "lib/commands",
  ".js"
);

client.login(config.BOT_TOKEN);

export interface CommandInterface {
  name: string;
  description: string;
  args: boolean;
  usage: string;
  execute(message: Message, args?: Array<string>);
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Time to get cereal!");
});

client.on("message", (message: Message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLocaleLowerCase();

  try {
    const executable: CommandInterface = commands.get(command);
    if (executable.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;
      if (executable.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${executable.name} ${executable.usage}\``;
      }
      message.channel.send(reply);
    } else {
      commands.get(command).execute(message, args);
    }
  } catch (error) {
    console.error(error);
    message.reply("I'm sorry, but I couldn't execute that command.");
  }
});
