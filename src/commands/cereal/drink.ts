import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import _ from "lodash";
import { getCerealColor, trim, getRandomNumber } from "../../utils";
import { COCKTAIL, DISCORD } from "../../../config.json";
import { Drink } from "../../models/drink";
import { Ingredient } from "../../models/ingredient";
import logger from "../../logging";

const fetchDrinks = async (url: string): Promise<Object> => {
  return await fetch(url, {}).then(response => response.json());
};

/**
 * Parsing the Ingredients from JSON to an Ingredients array
 * @param res - Response Drink JSON Object
 * @param max_num - Maximum number of Ingredients
 * @returns A parsed array of Ingredients
 */
const parseIngredientsFieldsList = (res: Object, max_num: number = 16): Ingredient[] => {
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

/**
 * Parsing the measurements of ingredients
 * @param string - The string of the measurements
 * @returns An array with the measurements
 */
const parseMeasure = (string: String): [string | null, string | null, string | null] => {
  const result = string.split(" ");
  return [result[0] ?? null, result[1] ?? null, result[2] ?? null];
};

/**
 * Select a drink JSON from an array
 * @param res - Response with JSON array
 * @returns One drink JSON
 */
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

  throw new Error("No drink was found in API response");
};

/**
 * Parse a JSON object to Drink
 * @param drink_res - JSON object to parse
 * @returns The Drink object
 */
const parseObjectToDrink = (drink_res: Object): Drink => {
  const id = drink_res["idDrink"];
  const name = drink_res["strDrink"];
  const category = drink_res["strCategory"];
  const instructions = drink_res["strInstructions"];
  const thumb_nail = drink_res["strDrinkThumb"];
  const glas = drink_res["strGlass"];
  const picture = drink_res["strImageSource"];

  const ingredients = parseIngredientsFieldsList(drink_res);

  const drink = new Drink(_.toInteger(id), name, category, instructions, thumb_nail, glas, ingredients, picture);
  return drink;
};

const createDrinkEmbed = async (result: Drink): Promise<{ embeds: MessageEmbed[] }> => {
  const ingredients = result.ingredient.map(x => `- ${x.toString()}`).join("\n");

  const embed = {
    embeds: [
      new MessageEmbed()
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
        ),
    ],
  };
  return embed;
};

const dispatch = async (args: string[]): Promise<{ embeds: MessageEmbed[] }> => {
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

const mix_drink = async (url: string): Promise<{ embeds: MessageEmbed[] }> => {
  return await fetchDrinks(url).then(selectDrinkFromList).then(parseObjectToDrink).then(createDrinkEmbed);
};

module.exports = {
  name: "drink",
  description: "Get a drink randomly or by choice :beers: :tropical_drink:",
  hasArgs: false,
  neededUserPermissions: [],
  usage: "<drink> | <starting_letter>",
  async execute(message: Message, args: string[]) {
    const result = await dispatch(args).catch(e => {
      logger.error(`Fetching drink "${args.join(" ")}" failed:\n${e}`);
      const embed = {
        embeds: [
          new MessageEmbed()
            .setColor(getCerealColor())
            .setTitle("404 Drink not found")
            .setImage("attachment://empty_glass.jpg"),
        ],
        files: ["./resources/pictures/errors/empty_glass.jpg"],
      };
      return embed;
    });

    message.channel.send(result);
  },
  parseIngredientsFieldsList,
  selectDrinkFromList,
};
