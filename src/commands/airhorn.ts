import fs from "fs";
import { Message, VoiceConnection } from "discord.js";
import utils from "../utils";
import config from "../../config.json";

const pathToAirhornFiles: string = "./resources/sounds/airhorns";

const airhornFiles: Array<string> = utils.findFilesWithEnding(
  pathToAirhornFiles,
  config.AUDIO_FILE_FORMAT
);

let lastIndexOfAudioFile: number = 0;

/**
 * Plays an audio file using the Bot user in the audio channel, of whoever wrote the message.
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

/**
 * Plays back a random sound from the directory
 * @param message - Message from Discord
 * @param pathToAudioFiles - Path to the Audio files
 * @param audioFiles - List of Audio files to play
 * @param lastIndexOfAudioFile - Latest index of the played file
 * @returns - The index of the last played file
 */
const airhorn = async (
  message: Message,
  pathToAudioFiles: string,
  audioFiles: Array<string>,
  lastIndexOfAudioFile: number
): Promise<number> => {
  const chooseFileNumber: number = utils.getRandomNumber(
    audioFiles.length,
    lastIndexOfAudioFile
  );
  const chosenFile: string = `${pathToAudioFiles}/${audioFiles[chooseFileNumber]}`;

  if (audioFiles.length === 0) {
    message.channel.send("The Airhorns were stolen :fearful:");
  } else if (!message.member.voice.channel) {
    message.channel.send("You need to enter a voice channel ~");
  } else {
    await playAudio(message, chosenFile);
  }
  return chooseFileNumber;
};

module.exports = {
  name: "airhorn",
  description: "Plays a random BEEEP!",
  args: false,
  cooldown: 5,
  usage: "",
  async execute(message: Message) {
    lastIndexOfAudioFile = await airhorn(
      message,
      pathToAirhornFiles,
      airhornFiles,
      lastIndexOfAudioFile
    );
  },
};
