import { Message } from "discord.js";

export default module.exports = {
  name: "sum",
  description: "A cereal accumulation of given numbers!",
  args: true,
  usage: "<number1> <number2> ... <numberN>",
  execute(message: Message, args: string[]) {
    const parsedValues = args.map((x) => parseFloat(x));
    const result = parsedValues.reduce((counter, x) => (counter += x));
    message.reply(`The sum of all the arguments you provided is ${result}!`);
  },
};
