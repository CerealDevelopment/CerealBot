import { Message, MessageEmbed } from "discord.js/typings/index.js";
import logger from "../../logging";
import { getCerealColor } from "../../utils";

const setChannel = (channel: string) => {

}

const post = () => {

}

const getNewsStories = () => {

}

module.exports = {
    name: "drink",
    description: "Get a drink randomly or by choice :beers: :tropical_drink:",
    hasArgs: false,
    neededUserPermissions: [],
    usage: "<drink> | <starting_letter>",
    async execute(message: Message, args: string[]) {
      const result = await dispatch(args).catch(e => {
        logger.error(`Fetching drink "${args.join(" ")}" failed:\n${e}`);
        const embed = {
          embeds: [
            new MessageEmbed()
              .setColor(getCerealColor())
              .setTitle("404 Drink not found")
              .setImage("attachment://empty_glass.jpg"),
          ],
          files: ["./resources/pictures/errors/empty_glass.jpg"],
        };
        return embed;
      });
  
      message.channel.send(result);
    },
  };
  