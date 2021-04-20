import fs from "fs";
import { Collection, Message } from "discord.js";

/**
 * Find all files from a given directory with a given file ending.
 * @param directory - Directory to find files in.
 * @param endsWith - The file ending to find.
 * @returns - An array consisting of the file names.
 */
const findFilesWithEnding = (
  directory: string,
  endsWith: string
): Array<string> => {
  return fs.readdirSync(directory).filter((file) => file.endsWith(endsWith));
};

/**
 * Checks, if a string ends on one of the given endings
 * @param str - String to check the ending of
 * @param fileEndings - Set with all acceptable string endings
 * @returns - A boolean, that becomes true, if the string ends on the fileEnding Set
 */
const resourceEndsWith = (str: string, fileEndings: Set<string>): boolean => {
  const splitArray = str.split(".");
  if (!splitArray.length) {
    return false;
  }
  const urlEnd = splitArray[splitArray.length - 1];
  return fileEndings.has(urlEnd);
};

/**
 * Generates a random integer from 0 to a set max value, while avoiding the last generated value.
 * @param maxValue - The max value of the random number.
 * @param lastNumber - The last random number that was created.
 * @returns - A random number, that is different than the last number.
 */
const getRandomNumber = (maxValue: number, lastNumber: number = 0): number => {
  const newNumber = Math.floor(Math.random() * maxValue);
  if (newNumber === lastNumber) return getRandomNumber(maxValue, lastNumber);
  return newNumber;
};

/**
 * Simply holds the most cereal color code.
 * @returns - The most cereal color code.
 */
const getCerealColor = (): string => {
  return "#ffd203";
};

const commandMap = (() => {
  const collection: Collection<string, CommandInterface> = new Collection();

  const commandFolders = fs.readdirSync("lib/commands");
  for (const folder of commandFolders) {
    const commandFiles: Array<string> = findFilesWithEnding(
      `lib/commands/${folder}`,
      ".js"
    );
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      collection.set(command.name, command);
    }
  }
  return collection;
})();

function getCommandMap(): Collection<string, CommandInterface> {
  return commandMap;
}

/**
 * The length of a string is checked and trimmed if it's longer than the given maximum length.
 * @param str The string which is checked and potentially be trimmed
 * @param max The threshold at which length ´str´ is trimmed
 */
const trim = (str: string, max: number): string => {
  return str.length > max ? `${str.slice(0, max - 3)}...` : str;
};

interface CommandInterface {
  name: string;
  description: string;
  hasArgs: boolean;
  needsAdmin: boolean;
  usage: string;
  execute(message: Message, args?: Array<string>);
}

export {
  findFilesWithEnding,
  getRandomNumber,
  getCommandMap,
  CommandInterface,
  resourceEndsWith,
  getCerealColor,
  trim,
};
