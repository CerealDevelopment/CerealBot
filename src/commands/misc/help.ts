import { Message } from "discord.js";
import { CommandInterface, getCommandMap } from "../../utils";
import config from "../../../config.json";

const prefix: string = config.PREFIX ? config.PREFIX : "!";

const getFormattedAnswer = async (args: string[]): Promise<string> => {
  if (!args.length) {
    // Simple list of all commands if no arg is provided
    const commandString = getCommandMap()
      .keyArray()
      .reduce(
        (total: string, currentVal: string, index: number, array: string[]) => {
          const joiner = "\n- ";
          const str = `${total}${joiner}${currentVal}`;
          // The first and last index shall add a code style format (markdown). The other steps simply add the known commands.
          if (index === 1) {
            return `\`\`\`${joiner}${str}`;
          } else if (index === array.length - 1) {
            return `${str}\`\`\``;
          } else {
            return `${str}`;
          }
        }
      );

    return `Here is a list of all featured commands:\n${commandString}\nFor more specific help type \`${prefix}help 'command_name'\`.`;
  } else {
    // More specific command help
    const arg = args.shift().toLocaleLowerCase();
    const command: CommandInterface = getCommandMap().get(arg);
    if (!command) {
      return "Unknown command: " + arg;
    } else {
      let answer =
        "\nName: " + command.name + "\nDescription: " + command.description;
      if (command.usage) {
        answer += "\nUsage: " + command.usage;
      }
      return answer;
    }
  }
};

module.exports = {
  name: "help",
  description: "Help for all commands of this bot.",
  hasArgs: false,
  usage: "",
  async execute(message: Message, args: string[]) {
    const result = await getFormattedAnswer(args);
    message.reply(`${result}`);
  },
  getFormattedAnswer,
};
