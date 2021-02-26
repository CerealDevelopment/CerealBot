import module from "module";

const ping = message => {
  const timeTaken = Date.now() - message.createdTimestamp;
  message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
};

const sum = (args, message) => {
  const numArgs = args.map(x => parseFloat(x));
  const sum = numArgs.reduce((counter, x) => counter += x);
  message.reply(`The sum of all the arguments you provided is ${sum}!`);
};

const cereal = message => {
  message.reply("Some Cereal stuff happening soon! (╯°□°）╯︵ ┻━┻");
};

export { ping, sum, cereal };