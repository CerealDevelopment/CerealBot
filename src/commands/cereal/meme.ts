import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import {
  resourceEndsWith,
  getCerealColor,
  getRandomNumber,
  trim,
} from "../../utils";
import _ from "lodash";
import { IMGUR, DISCORD } from "../../../config.json";

const headers = {
  Accept: "application/json",
  Authorization: IMGUR.AUTHORIZATION,
};

class ImgurImageEntry {
  title: string;
  description: string;
  link: string;
  nsfw: boolean;

  constructor(options = {}) {
    Object.assign(this, options);
  }
}

const imageEnding: Set<string> = new Set(["jpg", "png"]);

const handleImgurResult = (result: JSON): Array<ImgurImageEntry> => {
  const imgurResults: Array<ImgurImageEntry> = _.flatMap(
    result["data"]["items"],
    (item: JSON) => {
      if (item["is_album"]) {
        return _.map(item["images"], createNewEntry);
      } else {
        return createNewEntry(item);
      }
    }
  );
  return _.compact(imgurResults);
};

const createNewEntry = (json: JSON): ImgurImageEntry | null => {
  if (resourceEndsWith(json["link"], imageEnding))
    return new ImgurImageEntry(json);
  else return null;
};

const createMessageEmbed = (imgurObject: ImgurImageEntry): MessageEmbed => {
  const title = imgurObject.title ?? "";
  const desc = imgurObject.description ?? "";
  const link = imgurObject.link;
  return new MessageEmbed()
    .setColor(getCerealColor())
    .setTitle(trim(title, DISCORD.EMBED.TITLE_CHAR_LIMIT))
    .setDescription(trim(desc, DISCORD.EMBED.DESC_CHAR_LIMIT))
    .setImage(link);
};

const fetchImgurResult = async (): Promise<string | MessageEmbed> => {
  const imgurResult = await fetch(IMGUR.URL, { headers: headers })
    .then((response) => response.json())
    .catch((error: Error) => console.error(error));
  const imgurObjectLinks = handleImgurResult(imgurResult);
  const randomImgurObject =
    imgurObjectLinks[getRandomNumber(imgurObjectLinks.length - 1)];
  return createMessageEmbed(randomImgurObject);
};

module.exports = {
  name: "meme",
  hasArgs: false,
  usage: "",
  description: "Post a random (hopefully) meme image.",
  async execute(message: Message) {
    message.channel.send(await fetchImgurResult());
  },
};
