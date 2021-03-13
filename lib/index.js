"use strict";

var _discord = require("discord.js");

var _config = _interopRequireDefault(require("../config.json"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const client = new _discord.Client();
const prefix = _config.default.PREFIX;
let commands = new _discord.Collection();

let commandFiles = _fs.default.readdirSync('lib/commands').filter(file => file.endsWith('.js'));

client.login(_config.default.BOT_TOKEN);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Time to get cereal!");
});
client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLocaleLowerCase();

  try {
    const executable = commands.get(command);

    if (executable.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (executable.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${executable.name} ${executable.usage}\``;
      }

      message.channel.send(reply);
    } else {
      commands.get(command).execute(message, args);
    }
  } catch (error) {
    console.error(error);
    message.reply('I\'m sorry, but I couldn\'t execute that command.');
  }
});