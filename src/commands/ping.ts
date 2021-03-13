import { Message } from "discord.js";

module.exports = {
  name: "ping",
  description: "pong",
  args: false,
  usage: "",
  execute(message: Message) {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  },
};
