import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import _ from "lodash";
import { getCerealColor, trim, getRandomNumber, createError } from "../../utils";
import { COCKTAIL, DISCORD } from "../../../config.json";
import { Drink } from "../../models/drink";
import { Ingredient } from "../../models/ingredient";

const dispatch = async (args: string[]): Promise<Drink | void> => {
  const baseUrl = `${COCKTAIL.BASE_URL}${COCKTAIL.API_VERSION}${COCKTAIL.API_KEY}`;
  let drink_url = baseUrl;
  if (args.length === 0) {
    drink_url += COCKTAIL.RANDOM_URL;
  } else if (args[0].length === 1) {
    const search_for_letter: string = args[0];
    drink_url += `${COCKTAIL.SEARCH_LETTER_URL}${search_for_letter}`;
  } else {
    const search_for_drink: string = _.toLower(_.join(args, "_"));
    drink_url += `${COCKTAIL.SEARCH_URL}${search_for_drink}`;
  }
  return mix_drink(drink_url);
};

const mix_drink = async (url: string): Promise<Drink | void> => {
  return await fetchDrinks(url)
    .then(selectDrinkFromList)
    .then(parseObjectToDrink)
    .catch(e => console.log(`Error for: ${url}\n${e}`));
};

const fetchDrinks = async (url: string): Promise<Object> => {
  const res = await fetch(url, {})
    .then(response => response.json())
    .catch((e: Error) => {
      console.log(e);
    });

  return res;
};

const generateFieldsList = (res: Object, max_num: number = 16): Ingredient[] => {
  const nameOfIngredientsField: string = "strIngredient";
  const nameOfMeasureField: string = "strMeasure";

  const ingredientList: Ingredient[] = [];
  for (let i = 1; i < max_num; i++) {
    const name = res[`${nameOfIngredientsField + i}`];
    // Iterate until null
    if (!name) {
      break;
    }

    const measure_field = `${nameOfMeasureField + i}`;
    let amount: string, scale: string, special: string;
    if (res[measure_field]) {
      [amount, scale, special] = parseMeasure(res[measure_field]);
    } else {
      [amount, scale, special] = _.fill(Array(3), null);
    }
    ingredientList.push(new Ingredient(name, amount, scale, special));
  }
  return ingredientList;
};

const parseMeasure = (string: String): [string | null, string | null, string | null] => {
  const result = string.split(" ");
  return [result[0] ?? null, result[1] ?? null, result[2] ?? null];
};

const selectDrinkFromList = async (res: Object): Promise<Object> => {
  if (!_.isUndefined(res)) {
    const drink_list_res: Object[] = res["drinks"];
    if (!_.isEmpty(drink_list_res)) {
      if (drink_list_res.length === 1) {
        return drink_list_res[0];
      }

      const number_of_drinks: number = drink_list_res.length - 1;
      const drink_number: number = getRandomNumber(number_of_drinks, -1);
      return drink_list_res[drink_number];
    }
  }
  throw new Error("No drink was found");
};

const parseObjectToDrink = (drink_res: Object): Drink => {
  const id = drink_res["idDrink"];
  const name = drink_res["strDrink"];
  const category = drink_res["strCategory"];
  const instructions = drink_res["strInstructions"];
  const thumb_nail = drink_res["strDrinkThumb"];
  const glas = drink_res["strGlass"];
  const picture = drink_res["strImageSource"];

  const ingredients = generateFieldsList(drink_res);

  const drink = new Drink(_.toInteger(id), name, category, instructions, thumb_nail, glas, ingredients, picture);
  return drink;
};

const processDrink = async (args: string[]): Promise<string | MessageEmbed> => {
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
  usage: "<drink> | <starting_letter>",
  async execute(message: Message, args: string[]) {
    const result = await processDrink(args);

    message.channel.send(result);
  },
  generate_fields_list: generateFieldsList,
  select_drink_from_list: selectDrinkFromList,
};
