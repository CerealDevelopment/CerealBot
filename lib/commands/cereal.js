"use strict";

module.exports = {
  name: 'cereal',
  desciption: 'A really cereal message!',
  args: false,
  usage: '',

  execute(message) {
    message.channel.send('Some Cereal stuff happening soon! (╯°□°）╯︵ ┻━┻');
  }

};