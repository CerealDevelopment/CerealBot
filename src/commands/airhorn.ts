import fs from "fs";
import { Message, VoiceConnection } from "discord.js";

const pathToAirhornFiles: string = "./resources/sounds/airhorns";

const airhornFiles: Array<string> = fs
  .readdirSync(pathToAirhornFiles)
  .filter((file) => file.endsWith(".wav"));

async function airhorn(
  message: Message,
  pathToAirhornFiles: string,
  airhornFiles: Array<string>
) {
  const chooseFile: number = Math.floor(Math.random() * airhornFiles.length);

  if (airhornFiles.length === 0) {
    message.channel.send("The Airhorns were stolen :fearful:");
  } else if (message.member.voice.channel) {
    const audioFile: fs.ReadStream = fs.createReadStream(
      pathToAirhornFiles + "/" + airhornFiles[chooseFile]
    );
    const connection: VoiceConnection = await message.member.voice.channel.join();

    // Create a dispatcher
    const dispatcher = connection.play(audioFile, { type: "unknown" });

    dispatcher.setVolume(0.5);

    dispatcher.on("start", () => {
      console.log(airhornFiles[chooseFile] + " is now playing!");
    });

    dispatcher.on("finish", () => {
      console.log(airhornFiles[chooseFile] + " has finished playing!");
      dispatcher.destroy();
      connection.disconnect();
    });

    dispatcher.on("error", console.error);
    connection.on("error", console.error);
  }
}

module.exports = {
  name: "airhorn",
  description: "Plays a random BEEEP!",
  args: false,
  usage: "",
  execute(message: Message) {
    airhorn(message, pathToAirhornFiles, airhornFiles);
  },
};
