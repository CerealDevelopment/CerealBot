const Discord = require("discord.js");
const { write } = require("fs");
const config = require("./config.json");

const client = new Discord.Client();

const prefix = "/";

// client.on("typingStart", typingStart => {
//    console.log("typing");
//    console.dir(typingStart);
// });

client.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  switch (command) {
    case "ping":
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
      break;
    case "sum":
      const numArgs = args.map((x) => parseFloat(x));
      const sum = numArgs.reduce((counter, x) => (counter += x));
      message.reply(`The sum of all the arguments you provided is ${sum}!`);
      break;
    case "cereal":
      message.reply("Some Cereal stuff happening soon! (╯°□°）╯︵ ┻━┻");
      break;
    default:
  }
});

client.login(config.BOT_TOKEN);
