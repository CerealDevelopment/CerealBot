"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = module.exports = {
  name: 'sum',
  desciption: 'A cereal accumulation of given numbers!',
  args: true,
  usage: '<number1> <number2> ... <numberN>',

  execute(message, args) {
    const parsedValues = args.map(x => parseFloat(x));
    const result = parsedValues.reduce((counter, x) => counter += x);
    message.reply(`The sum of all the arguments you provided is ${result}!`);
  }

};

exports.default = _default;