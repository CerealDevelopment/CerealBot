import {
  generate_fields_list as generateFieldsList,
  select_drink_from_list as selectDrinkFromList,
} from "../lib/commands/cereal/drink";
import { compact, join, min, max, shuffle, random } from "lodash";

const test_drink = {
  idDrink: "17840",
  strDrink: "Affinity",
  strDrinkAlternate: null,
  strTags: null,
  strVideo: null,
  strCategory: "Ordinary Drink",
  strIBA: null,
  strAlcoholic: "Alcoholic",
  strGlass: "Cocktail glass",
  strInstructions:
    "In a mixing glass half-filled with ice cubes, combine all of the ingredients. Stir well. Strain into a cocktail glass.",
  strInstructionsES: null,
  strInstructionsDE:
    "In einem Mischglas, das halb mit Eisw\u00fcrfeln gef\u00fcllt ist, alle Zutaten vermengen. Gut umr\u00fchren. In ein Cocktailglas abseihen.",
  strInstructionsFR: null,
  strInstructionsIT:
    "In un mixing glass riempito a met\u00e0 con cubetti di ghiaccio, unire tutti gli ingredienti. Filtrare in un bicchiere da cocktail. Mescolare bene.",
  "strInstructionsZH-HANS": null,
  "strInstructionsZH-HANT": null,
  strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/wzdtnn1582477684.jpg",
  strIngredient1: "Scotch",
  strIngredient2: "Sweet Vermouth",
  strIngredient3: "Dry Vermouth",
  strIngredient4: "Orange bitters",
  strIngredient5: "Apple",
  strIngredient6: null,
  strIngredient7: null,
  strIngredient8: null,
  strIngredient9: null,
  strIngredient10: null,
  strIngredient11: null,
  strIngredient12: null,
  strIngredient13: null,
  strIngredient14: null,
  strIngredient15: null,
  strMeasure1: "1 1/2 oz ",
  strMeasure2: "1 oz ",
  strMeasure3: "1 oz ",
  strMeasure4: "2 dashes ",
  strMeasure5: "Slice",
  strMeasure6: null,
  strMeasure7: null,
  strMeasure8: null,
  strMeasure9: null,
  strMeasure10: null,
  strMeasure11: null,
  strMeasure12: null,
  strMeasure13: null,
  strMeasure14: null,
  strMeasure15: null,
  strImageSource: null,
  strImageAttribution: null,
  strCreativeCommonsConfirmed: "Yes",
  dateModified: "2017-09-07 21:44:05",
};

let i = 0;
it.each(generateFieldsList(test_drink))("generate_field_list should have 5 specific ingredients", n => {
  i += 1;
  expect(n).toBeDefined;
  expect(n.name).toBe(test_drink[`strIngredient${i}`]);

  const actual_ingredient = join(compact(n.toString().split(/:/)[1].split(/,|\s/)));
  const expected_ingredient = join(compact(test_drink[`strMeasure${i}`].split(/\s/)));
  expect(actual_ingredient).toBe(expected_ingredient);
});

it("generate_field_list finds 5 ingredients", () => {
  const result = generateFieldsList(test_drink);
  expect(result).toBeDefined;
  expect(result).toHaveLength(5);
});

const drinks = { drinks: shuffle(Array.from(Array(random(1, 10000, false)).keys())) };
it("select a random drink", async () => {
  const result = await selectDrinkFromList(drinks);
  expect(result).toBeDefined;
  expect(result).toBeTruthy;
  expect(result).toBeLessThanOrEqual(max(drinks.drinks));
  expect(result).toBeGreaterThanOrEqual(min(drinks.drinks));
});

const one_drink = { drinks: [1] };
it("select first drink", async () => {
  const result = await selectDrinkFromList(one_drink);
  expect(result).toBeDefined;
  expect(result).toBeTruthy;
  expect(result).toBe(one_drink.drinks[0]);
});

const error_message = "No drink was found";
const empty_drinks = { drinks: [] };
it("reject promise, because of empty array", async () => {
  expect.assertions(1);
  try {
    const result = await selectDrinkFromList(empty_drinks);
    console.log(result);
  } catch (e) {
    expect(e.message).toEqual(error_message);
  }
});

const undefined_drinks = undefined;
it("reject promise, because of undefined", async () => {
  expect.assertions(1);
  try {
    const result = await selectDrinkFromList(undefined_drinks);
    console.log(result);
  } catch (e) {
    expect(e.message).toEqual(error_message);
  }
});
