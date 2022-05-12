import { Message, MessageEmbed } from "discord.js";
import { getCerealColor, trim } from "../../utils";
import { DISCORD } from "../../../config.json";
import { selectRandomMeme } from "../../data/memeDataAccess";
import { MemeResource } from "../../models/meme";
import logger from "../../logging";

/**
 * A meme is transformed to a MessageEmbed
 * @param meme A meme
 * @returns A MessageEmbed with meme content
 */
const createMessageEmbed = (meme: MemeResource): { embeds: [MessageEmbed] } => {
  const title = meme.title ?? "";
  const desc = meme.description ?? "";
  const link = meme.link;
  return {
    embeds: [
      new MessageEmbed()
        .setColor(getCerealColor())
        .setTitle(trim(title, DISCORD.EMBED.TITLE_CHAR_LIMIT))
        .setDescription(trim(desc, DISCORD.EMBED.DESC_CHAR_LIMIT))
        .setImage(link),
    ],
  };
};

module.exports = {
  name: "meme",
  hasArgs: false,
  neededUserPermissions: [],
  usage: "",
  description: "Post a random (hopefully) funny meme image.",
  async execute(message: Message) {
    const currentMeme = await selectRandomMeme()
      .then(result => {
        return createMessageEmbed(result);
      })
      .catch(error => {
        logger.error(error);
        return "No Meme found :fearful:";
      });

    message.channel.send(currentMeme);
  },
};
