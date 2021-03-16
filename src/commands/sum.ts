import { Message } from "discord.js";

function sum(args: string[]): Number {
  const parsedValues = args.map((x) => parseFloat(x));
  return parsedValues.reduce((counter, x) => (counter += x));
}

export default module.exports = {
  name: "sum",
  description: "A cereal accumulation of given numbers!",
  args: true,
  usage: "<number1> <number2> ... <numberN>",
  execute(message: Message, args: string[]) {
    const result = sum(args);
    message.reply(`The sum of all the arguments you provided is ${result}!`);
  },
  testable_fun: sum,
};
