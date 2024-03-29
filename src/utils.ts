import fs from "fs";
import { Collection, Message, HexColorString } from "discord.js";
import _ from "lodash";

/**
 * Find all files from a given directory with a given file ending.
 * @param directory - Directory to find files in.
 * @param endsWith - The file ending to find.
 * @returns - An array consisting of the file names.
 */
const findFilesWithEnding = (directory: string, endsWith: string): Array<string> => {
  return fs.readdirSync(directory).filter(file => file.endsWith(endsWith));
};

/**
 * Generates a random integer from 0 to a set max value, while avoiding the last generated value.
 * @param maxValue - The max value of the random number.
 * @param lastNumber - The last random number that was created.
 * @returns - A random number, that is different than the last number.
 */
const getRandomNumber = (maxValue: number, lastNumber: number = 0): number => {
  const newNumber = _.random(0, maxValue);
  if (newNumber === lastNumber) return getRandomNumber(maxValue, lastNumber);
  return newNumber;
};

/**
 * Simply holds the most cereal color code.
 * @returns - The most cereal color code.
 */
const getCerealColor = (): HexColorString => {
  return "ffd203" as HexColorString;
};

/**
 * Create map with all commands in the command directory.
 */
const commandMap = (() => {
  const collection: Collection<string, CommandInterface> = new Collection();

  const commandFolders = fs.readdirSync("lib/commands");
  for (const folder of commandFolders) {
    const commandFiles: Array<string> = findFilesWithEnding(`lib/commands/${folder}`, ".js");
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      collection.set(command.name, command);
    }
  }
  return collection;
})();

const getCommandMap = (): Collection<string, CommandInterface> => {
  return commandMap;
};

/**
 * The length of a string is checked and trimmed if it's longer than the given maximum length.
 * @param str The string which is checked and potentially be trimmed
 * @param max The threshold at which length ´str´ is trimmed
 */
const trim = (str: string, max: number): string => {
  return _.truncate(str, { length: max });
};

/**
 * Returns either the input number or the min or max value
 * @param value The number to check
 * @param min The minimal value
 * @param max The maximum value
 * @returns An integer in range between min and max
 */
const numberInRange = (value: number, min: number = 1, max: number = 10): number => {
  if (min > max) {
    throw new Error(`min is ${min} but needs to be smaller or equal max which is ${max}`);
  }
  let numberOfPosts = Math.max(value, min);
  numberOfPosts = Math.min(numberOfPosts, max);
  return numberOfPosts;
};

interface CommandInterface {
  name: string;
  description: string;
  hasArgs: boolean;
  neededUserPermissions: string[];
  usage: string;
  execute(message: Message, args?: Array<string>);
}

export {
  findFilesWithEnding,
  getRandomNumber,
  getCommandMap,
  CommandInterface,
  getCerealColor,
  trim,
  numberInRange as keepIntInRange,
};
