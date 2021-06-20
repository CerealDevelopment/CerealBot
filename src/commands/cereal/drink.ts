import { Message, MessageEmbed } from "discord.js";
import querystring from "querystring";
import fetch from "node-fetch";
import { trim, getCerealColor } from "../../utils";
import { COCKTAIL } from "../../../config.json";
import { Drink } from "../../models/drink";
import { Ingredient } from "../../models/ingredient";

const dispatch = async (args: string[]) => {
  if (args.length === 0) {
    return parse_random_response(
      fetch_drink(`${COCKTAIL.BASE_URL}${COCKTAIL.RANDOM_URL}`)
    );
  }
};

const fetch_drink = async (url: string): Promise<Object> => {
  const { res } = await fetch(url, {})
    .then((response) => response.json())
    .catch((e: Error) => {
      console.log(e);
    });

  return [res];
};

const generate_fields_list = (
  name_of_ingredients_field: string = "strIngredient",
  max_num: number = 16
): string[] => {
  const list: string[] = [];
  for (let i = 1; i < max_num; i++) {
    list.push(name_of_ingredients_field + i);
  }
  return list;
};

const parse_random_response = (res: Object): Drink => {
  const drink_res = res["drinks"][0];

  const name = drink_res["strDrink"];
  const category = drink_res["strCategory"];
  const instructions = drink_res["strInstructions"];
  const thumb_nail = drink_res["strDrinkThumb"];
  const glas = drink_res["strGlass"];

  const ingredients_list = generate_fields_list();
  const measure_list = generate_fields_list("strMeasure");
  const ingredients = [new Ingredient()];

  const drink = new Drink(
    name,
    category,
    instructions,
    thumb_nail,
    glas,
    ingredients
  );
  return drink;
};

const drink = async (args: string[]): Promise<string | MessageEmbed> => {
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
    .setColor(getCerealColor())
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
  name: "drink",
  description: "Get a drink randomly or by choice :beers: :tropical_drink:",
  hasArgs: true,
  usage:
    "-d --drink <drink> \n -s --starting <starting_letter> \n -i --ingredient <ingredient>",
  async execute(message: Message, args: string[]) {
    const result = await drink(args);

    message.channel.send(result);
  },
};
