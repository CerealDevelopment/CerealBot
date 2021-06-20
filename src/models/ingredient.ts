class Ingredient {
  name: string;
  amount: number;
  scale: string;
  special: string | null;

  constructor(
    name: string,
    amount: number,
    scale: string,
    special: string | null
  ) {
    this.name = name;
    this.amount = amount;
    this.scale = scale;
    this.special = special;
  }
}

export { Ingredient };
