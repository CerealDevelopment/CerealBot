import { Ingredient } from "./ingredient-model";

class Drink {
  name: string;
  category: string;
  instructions: string;
  thumb_nail: string;
  glas: string;
  ingredient: Ingredient[];

  constructor(
    name: string,
    category: string,
    instructions: string,
    thumb_nail: string,
    glas: string,
    ingredient: Ingredient[]
  ) {
    this.name = name;
    this.category = category;
    this.instructions = instructions;
    this.thumb_nail = thumb_nail;
    this.glas = glas;
    this.ingredient = ingredient;
  }
}

export { Drink };
