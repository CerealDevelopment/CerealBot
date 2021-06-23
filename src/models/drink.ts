import { Ingredient } from "./ingredient";

class Drink {
  id: number;
  name: string;
  category: string;
  instructions: string;
  thumb_nail: string;
  picture: string | null;
  glas: string;
  ingredient: Ingredient[];

  constructor(
    id: number,
    name: string,
    category: string,
    instructions: string,
    thumb_nail: string,
    glas: string,
    ingredient: Ingredient[],
    picture: string | null
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.instructions = instructions;
    this.thumb_nail = thumb_nail;
    this.glas = glas;
    this.ingredient = ingredient;
    this.picture = picture;
  }
}

export { Drink };
