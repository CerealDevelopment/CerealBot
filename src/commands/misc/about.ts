import { Message } from "discord.js";

const getFormattedAnswer = async (): Promise<string> => {
  const aboutNote: string = "\nThanks for using the CerealBot developed by the CerealTeam. Released under Apache License 2.0.\n" +
                        "Please visit submit issues at https://github.com/CerealDevelopment/CerealBot/issues.\n" +
                        "Support us at https://www.buymeacoffee.com/wasuxemo"
  return aboutNote;
};

module.exports = {
  name: "about",
  description: "Help for all commands of this bot.",
  hasArgs: false,
  usage: "",
  async execute(message: Message) {
    const result = await getFormattedAnswer();
    message.reply(`${result}`);
  },
};
