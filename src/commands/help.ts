import { Message } from "discord.js";
import { getCommandMap } from "../utils";

// const command_list = utils.getCommandMap;

function printHelp(message: Message, args: string[]) {
  const commands = getCommandMap().keyArray();
  if (!args.length) {
    // Simple list of all commands if no arg is provided
    message.reply(
      // TODO individual prefix
      `Here is a list of all featured commands: 
      ${commands}
      For more specific help type !help <command>.`
    );
  } else {
    // More specific command help
  }
}

module.exports = {
  name: "help",
  description: "Help for all commands of this bot.",
  args: false,
  usage: "",
  execute(message: Message, args: string[]) {
    printHelp(message, args);
  },
};
