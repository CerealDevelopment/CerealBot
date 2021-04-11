import { Message, MessageEmbed } from "discord.js";
import querystring from "querystring";
import fetch from "node-fetch";

const trim = (str: string, max: number) =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;

const urban = async (args: string[]): Promise<string | MessageEmbed> => {
  const query = querystring.stringify({ term: args.join(" ") });

  const { list } = await fetch(
    `https://api.urbandictionary.com/v0/define?${query}`,
    {}
  )
    .then((response) => response.json())
    .catch((e: Error) => {
      console.log(e);
    });

  if (!list.length) {
    return `No results found for **${args.join(" ")}**.`;
  }

  const [answer] = list;
  const embed = new MessageEmbed()
    .setColor("#ffd203")
    .setTitle(answer.word)
    .setURL(answer.permalink)
    .addFields(
      { name: "Definition", value: trim(answer.definition, 1024) },
      { name: "Example", value: trim(answer.example, 1024) },
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
  args: true,
  usage: "<terms>",
  async execute(message: Message, args: string[]) {
    const result = await urban(args);

    message.channel.send(result);
  },
};
