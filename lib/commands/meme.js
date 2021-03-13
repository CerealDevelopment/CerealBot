"use strict";

var _discord = require("discord.js");

const attachments = [new _discord.MessageAttachment('./static/zerotwo.png', 'zerotwo.png')];
const zeroTwoEmbed = new _discord.MessageEmbed();
zeroTwoEmbed.setTitle(':P').attachFiles(attachments).setImage('attachment://zerotwo.png');
module.exports = {
  name: 'meme',
  args: false,
  usage: '',
  description: '',

  execute(message) {
    message.channel.send(zeroTwoEmbed);
  }

};