import { Message, MessageEmbed } from "discord.js";
import querystring from "querystring";
import fetch from "node-fetch";
import { trim, getCerealColor } from "../../utils";
import { URBAN, DISCORD } from "../../../config.json";
import logger from "../../logging";

interface Answer {
  word: string;
  permalink: string;
  definition: string;
  example: string;
  thumbs_up: number;
  thumbs_down: number;
}

const buildUrbanUrl = async (args: string[]): Promise<string> => {
  const query = querystring.stringify({ term: args.join(" ") });
  return `${URBAN.URL}${query}`;
};

const fetchUrban = async (url: string): Promise<any> => {
  const { list } = await fetch(url, {}).then(response => response.json());
  return list;
};

const checkResponse = (list: any[]): Answer[] => {
  if (list.length) {
    return <Answer[]>list;
  } else {
    throw new Error("Drink response is empty");
  }
};

const getFirstAnswer = (list: Answer[]): Answer => {
  const [answer] = list;
  return answer;
};

const buildEmbed = async (answer: Answer): Promise<{ embeds: MessageEmbed[] }> => {
  const embed = {
    embeds: [
      new MessageEmbed()
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
        ),
    ],
  };
  return embed;
};

const urban = async (args: string[]): Promise<{ embeds: MessageEmbed[] }> => {
  return await buildUrbanUrl(args).then(fetchUrban).then(checkResponse).then(getFirstAnswer).then(buildEmbed);
};

module.exports = {
  name: "urban",
  description: "Ask the urban dictionary",
  hasArgs: true,
  neededUserPermissions: [],
  usage: "<terms>",
  async execute(message: Message, args: string[]) {
    const result = await urban(args).catch(e => {
      logger.error(e);
      return {
        embeds: [new MessageEmbed().setTitle(`No results found for **${args.join(" ")}**.`).setColor(getCerealColor())],
      };
    });

    message.channel.send(result);
  },
  checkResponse,
  getFirstAnswer,
  buildEmbed,
};
