import { Message } from "discord.js";
import { getCommandMap } from "../utils";
import config from "../../config.json";

const prefix: string = config.PREFIX ? config.PREFIX : "!";

function printHelp(message: Message, args: string[]) {
  if (!args.length) {
    // Simple list of all commands if no arg is provided
    const commandString = getCommandMap()
      .keyArray()
      .reduce(
        (total: String, currentVal: String, index: number, array: string[]) => {
          const joiner = "\n- ";
          const str = `${total}${joiner}${currentVal}`;
          if (index === 1) {
            return `\`\`\`${joiner}${str}`;
          } else if (index === array.length - 1) {
            return `${str}\`\`\``;
          } else {
            return `${str}`;
          }
        }
      );

    message.reply(
      `Here is a list of all featured commands:\n${commandString}\nFor more specific help type \`${prefix}help 'command_name'\`.`
    );
  } else {
    // More specific command help
    const command = getCommandMap().get(args[0]);
    if (!command) {
      message.reply("Unknown command: " + args[0]);
    } else {
      let answer =
        "\nName: " + command.name + "\nDescription: " + command.description;
      if (command.usage) {
        answer += "\nUsage: " + command.usage;
      }
      message.reply(answer);
    }
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
