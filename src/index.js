import { Client } from "discord.js";
import config from "../config.json";
import utils from "./messages/utils.js";

const client = new Client();
const prefix = config.PREFIX;

// client.on("typingStart", typingStart => {
//    console.log("typing");
//    console.dir(typingStart);
// });

client.once('ready', () => {
	console.log('Time to get cereal!');
});

client.on("message", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  switch (command) {
    case "ping":
      utils.ping(message);
      break;
    case "sum":
      utils.sum(args, message)
      break;
    case "cereal":
      utils.cereal(message)
      break;
    default:
  }
});

client.login(config.BOT_TOKEN);
