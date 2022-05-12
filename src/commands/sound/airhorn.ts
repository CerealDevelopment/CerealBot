import _ from "lodash";
import { findFilesWithEnding, getRandomNumber } from "../../utils";
import config from "../../../config.json";
import logger from "../../logging";

import { VoiceChannel, Message } from "discord.js";
import { createDiscordJSAdapter } from "../../adapter";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerState,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} from "@discordjs/voice";

const player = createAudioPlayer();

const pathToAirhornFiles = "./resources/sounds/airhorns";

const airhornFiles: Array<string> = findFilesWithEnding(pathToAirhornFiles, config.AUDIO_FILE_FORMAT);
let lastIndexOfAudioFile = 0;

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

const playSong = async (file: string) => {
  const resource = createAudioResource(file, {
    inputType: StreamType.Arbitrary,
  });

  player.play(resource);

  return entersState(player, AudioPlayerStatus.Playing, 5e3);
};

const connectToChannel = async (channel: VoiceChannel) => {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: createDiscordJSAdapter(channel),
  });

  const timeout = 30000;
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, timeout);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
};

/**
 * Creates a new string without white spaces and all lower case letters
 * @param str: String to be changed
 * @returns String without white spaces and all lower case
 */
const removeAllWhiteSpacesAndToLower = (str: string): string => {
  return _.replace(_.lowerCase(str), /(\s+)/g, "");
};

interface AirhornListInterface {
  [index: string]: string;
}

const audioFileNames: AirhornListInterface = _.reduce(
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
  const channel: VoiceChannel = message.member?.voice.channel as VoiceChannel;
  if (channel) {
    try {
      const connection = await connectToChannel(channel);
      connection.subscribe(player);
      message.reply("Playing now!");

      console.log("Song is ready to play!");
      await playSong(chosenFile);

      // TODO check if this leads to memory leak
      player.addListener("stateChange", (oldState: AudioPlayerState, newState: AudioPlayerState) => {
        if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
          connection.disconnect();
        }
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    message.reply("Join a voice channel then try again!");
  }
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
  audioFileNames: AirhornListInterface,
  args: string[]
): Promise<void> => {
  const choice: string = removeAllWhiteSpacesAndToLower(_.join(args, "_"));
  const audioFile: string = _.get(audioFileNames, choice, "airhorn_default.ogg");
  const chosenFile = `${pathToAudioFiles}/${audioFile}`;

  return playAudio(message, chosenFile);
};

/**
 * Print all the available Airhorn sounds
 * @param message - Message from Discord
 * @param audioFileNames - A Object containing all files with names
 */
const printAirhornHelp = async (message: Message, audioFileNames: AirhornListInterface) => {
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
  const chosenFile = `${pathToAudioFiles}/${audioFiles[chooseFileNumber]}`;

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
  neededUserPermissions: [],
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
