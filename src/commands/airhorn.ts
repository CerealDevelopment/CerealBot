import fs from "fs";
import { Message, VoiceConnection } from "discord.js";
import utils from "../utils";

const pathToAirhornFiles: string = "./resources/sounds/airhorns";

const airhornFiles: Array<string> = utils.findFilesWithEnding(
  pathToAirhornFiles,
  ".wav"
);

async function playAudio(message: Message, chosenFile: string) {
  const audioFile: fs.ReadStream = fs.createReadStream(chosenFile);
  const connection: VoiceConnection = await message.member.voice.channel.join();

  const dispatcher = connection.play(audioFile, {
    type: "unknown",
    volume: 0.5,
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
}

async function airhorn(
  message: Message,
  pathToAirhornFiles: string,
  airhornFiles: Array<string>
) {
  const chooseFileNumber: number = Math.floor(Math.random() * airhornFiles.length);
  const chosenFile: string = `${pathToAirhornFiles}/${airhornFiles[chooseFileNumber]}`;

  if (airhornFiles.length === 0) {
    message.channel.send("The Airhorns were stolen :fearful:");
  } else if (message.member.voice.channel) {
    playAudio(message, chosenFile);
  } else {
    message.channel.send("You need to enter a voice channel ~");
  }
}

module.exports = {
  name: "airhorn",
  description: "Plays a random BEEEP!",
  args: false,
  cooldown: 5,
  usage: "",
  execute(message: Message) {
    airhorn(message, pathToAirhornFiles, airhornFiles);
  },
};
