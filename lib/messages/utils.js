"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const ping = message => {
  const timeTaken = Date.now() - message.createdTimestamp;
  message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
};

const sum = args => {
  const numArgs = args.map(x => parseFloat(x));
  return numArgs.reduce((counter, x) => counter += x);
}; // const messageSum = (sum: number, message: Message) => {
//   message.reply(`The sum of all the arguments you provided is ${sum}!`);
// }


const messageReply = (string, message) => {
  message.reply(string);
};

const cereal = message => {
  message.reply("Some Cereal stuff happening soon! (╯°□°）╯︵ ┻━┻");
};

var _default = {
  ping,
  sum,
  cereal,
  messageReply
};
exports.default = _default;