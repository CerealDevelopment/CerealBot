import { Message, MessageEmbed } from "discord.js";
import querystring from "querystring";
import fetch from "node-fetch";
import { trim, getCerealColor } from "../../utils";
import { URBAN, DISCORD } from "../../../config.json";
import logger from "../../logging";

const buildUrbanUrl = async (args: string[]): Promise<string> => {
  const query = querystring.stringify({ term: args.join(" ") });
  return `${URBAN.URL}${query}`;
};

const fetchUrban = async (url: string): Promise<any> => {
  const { list } = await fetch(url, {}).then(response => response.json());
  return list;
};

const checkResponse = (list: any[]): any[] => {
  if (list.length) {
    return list;
  } else {
    throw new Error("Response is empty");
  }
};

const getAnswer = (list: any[]): any => {
  const [answer] = list;
  return answer;
};

const buildEmbed = async (answer: any): Promise<MessageEmbed> => {
  const embed = new MessageEmbed()
    .setColor(getCerealColor())
    .setTitle(answer.word)
    .setURL(answer.permalink)
    .addFields(
      {
        name: "Definition",
        value: trim(answer.definition, DISCORD.EMBED.FIELD_CHAR_LIMIT),
      },
      {
        name: "Example",
        value: trim(answer.example, DISCORD.EMBED.FIELD_CHAR_LIMIT),
      },
      {
        name: "Rating",
        value: `${answer.thumbs_up} :thumbsup: ${answer.thumbs_down} :thumbsdown:`,
      }
    );
  return embed;
};

const urban = async (args: string[]): Promise<MessageEmbed> => {
  return await buildUrbanUrl(args).then(fetchUrban).then(checkResponse).then(getAnswer).then(buildEmbed);
};

module.exports = {
  name: "urban",
  description: "Ask the urban dictionary",
  hasArgs: true,
  usage: "<terms>",
  async execute(message: Message, args: string[]) {
    const result = await urban(args).catch(e => {
      logger.error(e);
      return `No results found for **${args.join(" ")}**.`;
    });

    message.channel.send(result);
  },
};
