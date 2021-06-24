import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import _ from "lodash";
import { getCerealColor, trim, getRandomNumber, createError } from "../../utils";
import { COCKTAIL, DISCORD } from "../../../config.json";
import { Drink } from "../../models/drink";
import { Ingredient } from "../../models/ingredient";

const dispatch = async (args: string[]): Promise<Drink | void> => {
  const base_url = `${COCKTAIL.BASE_URL}${COCKTAIL.API_VERSION}${COCKTAIL.API_KEY}`;
  let drink_url = base_url;
  if (args.length === 0) {
    drink_url += COCKTAIL.RANDOM_URL;
  } else if (_.includes(["-d", "--drink"], args[0])) {
    const search_for_drink: string = _.toLower(_.join(args.slice(1), "_"));
    drink_url += `${COCKTAIL.SEARCH_URL}${search_for_drink}`;
  } else if (_.includes(["-s", "--starting"], args[0])) {
    const search_for_letter: string = args[1];
    drink_url += `${COCKTAIL.SEARCH_LETTER_URL}${search_for_letter}`;
  }
  return mix_drink(drink_url);
};

const mix_drink = async (url: string): Promise<Drink | void> => {
  return await fetch_drinks(url)
    .then(select_drink_from_list)
    .then(parse_object_to_drink)
    .catch(e => console.log(`Error for: ${url}\n${e}`));
};

const fetch_drinks = async (url: string): Promise<Object> => {
  const res = await fetch(url, {})
    .then(response => response.json())
    .catch((e: Error) => {
      console.log(e);
    });

  return res;
};

const generate_fields_list = (res: Object, max_num: number = 16): Ingredient[] => {
  const name_of_ingredients_field: string = "strIngredient";
  const name_of_measure_field: string = "strMeasure";

  const ingredient_list: Ingredient[] = [];
  for (let i = 1; i < max_num; i++) {
    const name = res[`${name_of_ingredients_field + i}`];
    // Iterate until null
    if (!name) {
      break;
    }

    const measure_field = `${name_of_measure_field + i}`;
    let amount: string, scale: string, special: string;
    if (res[measure_field]) {
      [amount, scale, special] = parse_measure(res[measure_field]);
    } else {
      [amount, scale, special] = _.fill(Array(3), null);
    }
    ingredient_list.push(new Ingredient(name, amount, scale, special));
  }
  return ingredient_list;
};

const parse_measure = (string: String): [string | null, string | null, string | null] => {
  const result = string.split(" ");
  return [result[0] ?? null, result[1] ?? null, result[2] ?? null];
};

const select_drink_from_list = async (res: Object): Promise<Object> => {
  const drink_list_res: Object[] = res["drinks"];
  if (drink_list_res.length != 0) {
    const number_of_drinks: number = drink_list_res.length - 1;
    const drink_number: number = getRandomNumber(number_of_drinks, -1);

    return drink_list_res[drink_number];
  } else {
    throw new Error("No drink was found");
  }
};

const parse_object_to_drink = (drink_res: Object): Drink => {
  const id = drink_res["idDrink"];
  const name = drink_res["strDrink"];
  const category = drink_res["strCategory"];
  const instructions = drink_res["strInstructions"];
  const thumb_nail = drink_res["strDrinkThumb"];
  const glas = drink_res["strGlass"];
  const picture = drink_res["strImageSource"];

  const ingredients = generate_fields_list(drink_res);

  const drink = new Drink(_.toInteger(id), name, category, instructions, thumb_nail, glas, ingredients, picture);
  return drink;
};

const process_drink = async (args: string[]): Promise<string | MessageEmbed> => {
  const result: Drink | void = await dispatch(args);
  if (result) {
    const ingredients = result.ingredient.map(x => `- ${x.toString()}`).join("\n");

    const embed = new MessageEmbed()
      .setColor(getCerealColor())
      .setTitle(result.name)
      .setDescription(result.category)
      .setThumbnail(result.thumb_nail)
      .addFields(
        {
          name: "Ingredients",
          value: trim(ingredients, DISCORD.EMBED.FIELD_CHAR_LIMIT),
        },
        {
          name: "Instructions",
          value: trim(result.instructions, DISCORD.EMBED.FIELD_CHAR_LIMIT),
        }
      );
    return embed;
  } else {
    return "404 Drink not found";
  }
};

module.exports = {
  name: "drink",
  description: "Get a drink randomly or by choice :beers: :tropical_drink:",
  hasArgs: false,
  usage: "-d --drink <drink>\n-s --starting <starting_letter>",
  async execute(message: Message, args: string[]) {
    const result = await process_drink(args);

    message.channel.send(result);
  },
  generate_fields_list,
  select_drink_from_list,
};
