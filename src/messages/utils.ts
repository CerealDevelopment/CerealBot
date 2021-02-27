import { Message } from "discord.js";
import module from "module";

const ping = (message: Message) => {
  const timeTaken = Date.now() - message.createdTimestamp;
  message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
};

const sum = (args: string[]) => {
  const numArgs = args.map((x) => parseFloat(x));
  return numArgs.reduce((counter, x) => (counter += x));
};

// const messageSum = (sum: number, message: Message) => {
//   message.reply(`The sum of all the arguments you provided is ${sum}!`);
// }

const messageReply = (string: string, message: Message) => {
  message.reply(string);
}

const cereal = (message: Message) => {
  message.reply("Some Cereal stuff happening soon! (╯°□°）╯︵ ┻━┻");
};

export default {
  ping,
  sum,
  cereal,
  messageReply,
};
