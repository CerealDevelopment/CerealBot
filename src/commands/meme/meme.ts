import { Message, MessageEmbed } from "discord.js";
import { getCerealColor, trim } from "../../utils";
import _ from "lodash";
import { DISCORD } from "../../../config.json";
import { selectRandomMeme } from "../../commands/meme/memeService";
import { MemeResource } from "../../types";

/**
 *
 * @param imgurObject
 * @returns MessageEmbed The content is wrapped in a MessageEmbed
 */
const createMessageEmbed = (imgurObject: MemeResource): MessageEmbed => {
  const title = imgurObject.title ?? "";
  const desc = imgurObject.description ?? "";
  const link = imgurObject.link;
  return new MessageEmbed()
    .setColor(getCerealColor())
    .setTitle(trim(title, DISCORD.EMBED.TITLE_CHAR_LIMIT))
    .setDescription(trim(desc, DISCORD.EMBED.DESC_CHAR_LIMIT))
    .setImage(link);
};

module.exports = {
  name: "meme",
  hasArgs: false,
  usage: "",
  description: "Post a random (hopefully) funny meme image.",
  async execute(message: Message) {
    const currentMeme = await selectRandomMeme().then(result => {
      return createMessageEmbed(result);
    });
    message.channel.send(currentMeme);
  },
};
