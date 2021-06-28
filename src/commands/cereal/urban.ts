import { Message, MessageEmbed } from "discord.js";
import querystring from "querystring";
import fetch from "node-fetch";
import { trim, getCerealColor } from "../../utils";
import { URBAN, DISCORD } from "../../../config.json";

const fetchUrban = async (url: string): Promise<any> => {
  const res = await fetch(url, {}).then(response => response.json());
  return res;
};

const urban = async (args: string[]): Promise<string | MessageEmbed> => {
  const query = querystring.stringify({ term: args.join(" ") });

  const { list } = await fetchUrban(`${URBAN.URL}${query}`);

  if (!list.length) {
    return `No results found for **${args.join(" ")}**.`;
  }

  const [answer] = list;
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

module.exports = {
  name: "urban",
  description: "Ask the urban dictionary",
  hasArgs: true,
  usage: "<terms>",
  async execute(message: Message, args: string[]) {
    const result = await urban(args).catch(e => {
      console.error(e)
      return `No results found for **${args.join(" ")}**.`;
    });

    message.channel.send(result);
  },
};
