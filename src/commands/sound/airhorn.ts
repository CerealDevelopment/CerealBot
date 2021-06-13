import fs from "fs";
import _ from "lodash";
import { Message, VoiceConnection } from "discord.js";
import { findFilesWithEnding, getRandomNumber } from "../../utils";
import config from "../../../config.json";

const pathToAirhornFiles: string = "./resources/sounds/airhorns";

const airhornFiles: Array<string> = findFilesWithEnding(
  pathToAirhornFiles,
  config.AUDIO_FILE_FORMAT
);

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
    const key = removeAllWhiteSpacesAndToLower(
      _.replace(value, /(airhorn_)|(.ogg)/gi, "")
    );
    result[key] = value;
    return result;
  },
  {}
);

let lastIndexOfAudioFile: number = 0;

/**
 * Play's an audio file using the Bot user in the audio channel, of who wrote the message.
 * @param message - Discord message to find the correct Audio channel to play the sound in
 * @param chosenFile - The file to be played in the channel
 */
const playAudio = async (message: Message, chosenFile: string) => {
  const audioFile: fs.ReadStream = fs.createReadStream(chosenFile);
  const connection: VoiceConnection = await message.member.voice.channel.join();

  const dispatcher = connection.play(audioFile, {
    type: "ogg/opus",
    volume: 0.5,
    highWaterMark: 50,
  });

  dispatcher.on("start", () => {
    console.log(`${chosenFile} is now playing!`);
  });

  dispatcher.on("finish", () => {
    console.log(`${chosenFile} has finished playing!`);
    dispatcher.destroy();
    connection.disconnect();
  });

  dispatcher.on("error", console.error);
  connection.on("error", console.error);
};

const checkAudioFiles = (message: Message, numberOfAudioFiles: number) => {
  if (numberOfAudioFiles === 0) {
    message.channel.send("The Airhorns were stolen :fearful:");
    throw new Error("No sound files are found for Airhorn");
  }
};

const checkUserInChannel = (message: Message) => {
  if (!message.member.voice.channel) {
    message.channel.send("You need to enter a voice channel ~");
    throw new Error(`The user "${message.author.id}" was not in a channel`);
  }
};

const hasAirhornErrors = (message: Message, numberOfAudioFiles: number) => {
  let result: boolean = false;
  if (
    _.isError(_.attempt(checkAudioFiles, message, numberOfAudioFiles)) ||
    _.isError(_.attempt(checkUserInChannel, message))
  ) {
    result = true;
  }
  return result;
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
  if (hasAirhornErrors(message, _.keys(audioFileNames).length)) {
    return;
  }
  const choice: string = removeAllWhiteSpacesAndToLower(_.join(args, "_"));
  const audioFile: string = _.get(
    audioFileNames,
    choice,
    "airhorn_default.ogg"
  );
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
  if (hasAirhornErrors(message, audioFiles.length)) {
    return 0;
  }

  const chooseFileNumber: number = getRandomNumber(
    audioFiles.length - 1,
    lastIndexOfAudioFile
  );
  const chosenFile: string = `${pathToAudioFiles}/${audioFiles[chooseFileNumber]}`;

  await playAudio(message, chosenFile);
  return chooseFileNumber;
};

module.exports = {
  name: "airhorn",
  description: "BEEEP!",
  hasArgs: false,
  cooldown: 5,
  usage: "",
  async execute(message: Message, args: string[]) {
    if (_.isEmpty(args)) {
      lastIndexOfAudioFile = await playRandomAirhorn(
        message,
        pathToAirhornFiles,
        airhornFiles,
        lastIndexOfAudioFile
      );
    } else if (args[0] === "help") {
      await printAirhornHelp(message, audioFileNames);
    } else {
      await playSpecificAudioFile(
        message,
        pathToAirhornFiles,
        audioFileNames,
        args
      );
    }
  },
};
