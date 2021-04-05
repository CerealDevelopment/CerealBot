import fs from "fs";
import { Collection, Message } from "discord.js";

/**
 * Find all files from a given directory with a given file ending.
 * @param directory - Directory to find files in.
 * @param endsWith - The file ending to find.
 * @returns - An array consisting of the file names.
 */
function findFilesWithEnding(
  directory: string,
  endsWith: string
): Array<string> {
  return fs.readdirSync(directory).filter((file) => file.endsWith(endsWith));
}

/**
 * Generates a random integer from 0 to a set max value, while avoiding the last generated value.
 * @param maxValue - The max value of the random number.
 * @param lastNumber - The last random number that was created.
 * @returns A random number, that is different than the last number.
 */
function getRandomNumber(maxValue: number, lastNumber: number = 0): number {
  const newNumber = Math.floor(Math.random() * maxValue);
  if (newNumber === lastNumber) return getRandomNumber(maxValue, lastNumber);
  return newNumber;
}

const commandMap = (() => {
  const commandFiles: Array<string> = findFilesWithEnding(
    "lib/commands",
    ".js"
  );
  const collection: Collection<string, CommandInterface> = new Collection();
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    collection.set(command.name, command);
  }
  return collection;
})();

function getCommandMap(): Collection<string, CommandInterface> {
  return commandMap;
}

interface CommandInterface {
  name: string;
  description: string;
  args: boolean;
  usage: string;
  execute(message: Message, args?: Array<string>);
}

export {
  findFilesWithEnding,
  getRandomNumber,
  getCommandMap,
  CommandInterface,
};
