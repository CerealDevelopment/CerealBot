import { Message, MessageEmbed } from "discord.js";
import { getCerealColor } from "../../utils";

const getFormattedAnswer = async (): Promise<MessageEmbed> => {
  const message = new MessageEmbed()
    .setColor(getCerealColor())
    .setTitle("About CerealBot")
    .setURL("https://github.com/CerealDevelopment/CerealBot")
    .setImage(
      "https://img.buymeacoffee.com/api/?url=aHR0cHM6Ly9jZG4uYnV5bWVhY29mZmVlLmNvbS91cGxvYWRzL2NvdmVyX2ltYWdlcy8yMDIxLzA0LzNhYmMyMTUyMWE0NGQzMTQyYWJlZTcxYzlkYzU3NjM0LmpwZw==&size=2560"
    )
    .setDescription(
      "\nThanks for using the CerealBot developed by the CerealTeam.\n" +
        "Released under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).\n" +
        "Please submit issues you encountered under [Github Issues](https://github.com/CerealDevelopment/CerealBot/issues).\n" +
        "Support us at [Buy Me a Coffee](https://www.buymeacoffee.com/CerealBot)."
    );

  return message;
};

module.exports = {
  name: "about",
  description: "Prints the about info for the CerealBot :robot:",
  hasArgs: false,
  usage: "",
  async execute(message: Message) {
    const result = await getFormattedAnswer();
    message.channel.send(result);
  },
};
