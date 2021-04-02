import { Message } from "discord.js";

const sum = async (args: string[]): Promise<number> => {
  const parsedValues = args.map((x) => parseFloat(x));
  return parsedValues.reduce((counter, x) => (counter += x));
};

export default module.exports = {
  name: "sum",
  description: "A cereal accumulation of given numbers!",
  args: true,
  usage: "<number1> <number2> ... <numberN>",
  async execute(message: Message, args: string[]) {
    const result = await sum(args);
    message.reply(`The sum of all the arguments you provided is ${result}!`);
  },
  testable_fun: sum,
};
