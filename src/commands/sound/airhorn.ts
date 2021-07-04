import fs from "fs";
import _ from "lodash";
import { Message, VoiceConnection } from "discord.js";
import { findFilesWithEnding, getRandomNumber } from "../../utils";
import config from "../../../config.json";
import logger from "../../logging";

const pathToAirhornFiles: string = "./resources/sounds/airhorns";

const airhornFiles: Array<string> = findFilesWithEnding(pathToAirhornFiles, config.AUDIO_FILE_FORMAT);
//TODO add Keyv guild storage
let lastIndexOfAudioFile: number = 0;

const possibleErrors = (msg: Message = null) => {
  let authorId = "";
  if (msg) {
    authorId = msg.author.id;
  }
  return {
    noFilesFound: "No sound files are found for Airhorn",
    notInVoiceChannel: `The user "${authorId}" was not in a channel`,
  };
};

/**
 * Creates a new string without white spaces and all lower case letters
 * @param str: String to be changed
 * @returns String without white spaces and all lower case
 */
const removeAllWhiteSpacesAndToLower = (str: string): string => {
  return _.replace(_.lowerCase(str), /(\s+)/g, "");
};

const audioFileNames: Object = _.reduce(
  airhornFiles,
  (result, value) => {
    const key = removeAllWhiteSpacesAndToLower(_.replace(value, /(airhorn_)|(.ogg)/gi, ""));
    result[key] = value;
    return result;
  },
  {}
);

/**
 * Play's an audio file using the Bot user in the audio channel, of who wrote the message.
 * @param message - Discord message to find the correct Audio channel to play the sound in
 * @param chosenFile - The file to be played in the channel
 */
const playAudio = async (message: Message, chosenFile: string) => {
  checkUserInChannel(message);
  const audioFile: fs.ReadStream = fs.createReadStream(chosenFile);
  const connection: VoiceConnection = await message.member.voice.channel.join();

  const dispatcher = connection.play(audioFile, {
    type: "ogg/opus",
    volume: 0.5,
    highWaterMark: 50,
  });

  dispatcher.on("start", () => {
    logger.info(`${chosenFile} is now playing!`);
  });

  dispatcher.on("finish", () => {
    logger.info(`${chosenFile} has finished playing!`);
    dispatcher.destroy();
    connection.disconnect();
  });

  dispatcher.on("error", logger.error);
  connection.on("error", logger.error);
};

const checkAudioFiles = (numberOfAudioFiles: number) => {
  if (numberOfAudioFiles === 0) {
    throw new Error(possibleErrors().noFilesFound);
  }
};

const checkUserInChannel = (message: Message) => {
  if (!message.member.voice.channel) {
    throw new Error(possibleErrors(message).notInVoiceChannel);
  }
};

/**
 * Play specific Airhorn file from JSON
 * @param message - Message from Discord
 * @param pathToAudioFiles - Path to the Audio files
 * @param audioFileNames - A JSON with all the available sounds
 * @param args - Args from user to select a sound
 * @returns - An async function that plays the sound
 */
const playSpecificAudioFile = async (
  message: Message,
  pathToAudioFiles: string,
  audioFileNames: Object,
  args: string[]
): Promise<void> => {
  const choice: string = removeAllWhiteSpacesAndToLower(_.join(args, "_"));
  const audioFile: string = _.get(audioFileNames, choice, "airhorn_default.ogg");
  const chosenFile: string = `${pathToAudioFiles}/${audioFile}`;

  return playAudio(message, chosenFile);
};

/**
 * Print all the available Airhorn sounds
 * @param message - Message from Discord
 * @param audioFileNames - A Object containing all files with names
 */
const printAirhornHelp = async (message: Message, audioFileNames: Object) => {
  const helpText = "A selection of our finest Airhorns:```";
  const names = _.keysIn(audioFileNames);
  const reply =
    helpText +
    _.reduce(
      names,
      (prev, curr) => {
        return `${prev}- ${curr}\n`;
      },
      "\n"
    ) +
    "```";

  message.reply(reply);
};

/**
 * Plays back a random sound from the directory
 * @param message - Message from Discord
 * @param pathToAudioFiles - Path to the Audio files
 * @param audioFiles - List of Audio files to play
 * @param lastIndexOfAudioFile - Latest index of the played file
 * @returns - The index of the last played file
 */
const playRandomAirhorn = async (
  message: Message,
  pathToAudioFiles: string,
  audioFiles: string[],
  lastIndexOfAudioFile: number
): Promise<number> => {
  const chooseFileNumber: number = getRandomNumber(audioFiles.length - 1, lastIndexOfAudioFile);
  const chosenFile: string = `${pathToAudioFiles}/${audioFiles[chooseFileNumber]}`;

  await playAudio(message, chosenFile);
  return chooseFileNumber;
};

const playAirhorn = async (message: Message, args: string[]) => {
  checkAudioFiles(_.keys(audioFileNames).length);
  if (_.isEmpty(args)) {
    lastIndexOfAudioFile = await playRandomAirhorn(message, pathToAirhornFiles, airhornFiles, lastIndexOfAudioFile);
  } else if (args[0] === "help") {
    await printAirhornHelp(message, audioFileNames);
  } else {
    await playSpecificAudioFile(message, pathToAirhornFiles, audioFileNames, args);
  }
};

module.exports = {
  name: "airhorn",
  description: "BEEEP!",
  hasArgs: false,
  cooldown: 5,
  usage: "",
  async execute(message: Message, args: string[]) {
    const result = await playAirhorn(message, args).catch((e: Error) => {
      logger.error(e);
      if (e.message === possibleErrors().noFilesFound) {
        return "The Airhorns were stolen :fearful:";
      } else if (e.message === possibleErrors(message).notInVoiceChannel) {
        return "You need to enter a voice channel ~";
      }
    });

    if (_.isString(result)) {
      message.reply(result);
    }
  },
};
