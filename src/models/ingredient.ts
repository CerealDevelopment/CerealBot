class Ingredient {
  name: string;
  amount: string;
  scale: string;
  special: string;

  constructor(name: string, amount: string | null, scale: string | null, special: string | null) {
    this.name = name;
    this.amount = amount ?? "";
    this.scale = scale ?? "";
    this.special = special ?? "";
  }

  toString() {
    let ingredientString = `${this.name}`;
    if (this.amount) {
      ingredientString += `: ${this.amount}`;
      if (this.scale) {
        ingredientString += ` ${this.scale}`;
      }
    }
    if (this.special) {
      ingredientString += `, ${this.special}`;
    }
    return ingredientString;
  }
}

export { Ingredient };
