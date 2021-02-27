"use strict";

var _discord = require("discord.js");

var _config = _interopRequireDefault(require("../config.json"));

var _utils = _interopRequireDefault(require("./messages/utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const client = new _discord.Client();
const prefix = _config.default.PREFIX; // client.on("typingStart", typingStart => {
//    console.log("typing");
//    console.dir(typingStart);
// });

client.once("ready", () => {
  console.log("Time to get cereal!");
});
client.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  switch (command) {
    case "ping":
      _utils.default.ping(message);

      break;

    case "sum":
      const result = _utils.default.sum(args);

      _utils.default.messageReply("The sum of all the arguments you provided is ${result}!", message);

      break;

    case "cereal":
      _utils.default.cereal(message);

      break;

    default:
  }
});
client.login(_config.default.BOT_TOKEN);