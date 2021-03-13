"use strict";

module.exports = {
  name: 'ping',
  desciption: 'pong',
  args: false,
  usage: '',

  execute(message) {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

};