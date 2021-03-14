import fs from "fs";
import { Message, VoiceConnection } from "discord.js";

async function airhorn(message: Message) {
  if (message.member.voice.channel) {
    const audioFile: fs.ReadStream = fs.createReadStream(
      "./resources/sounds/airhorn_default.wav"
    );
    const connection: VoiceConnection = await message.member.voice.channel.join();

    // Create a dispatcher
    const dispatcher = connection.play(audioFile, { type: "unknown" });

    dispatcher.setVolume(0.5);

    dispatcher.on("start", () => {
      console.log("airhorn_default.wav is now playing!");
    });

    dispatcher.on("finish", () => {
      console.log("airhorn_default.wav has finished playing!");
      dispatcher.destroy();
      connection.disconnect();
    });

    // Always remember to handle errors appropriately!
    dispatcher.on("error", console.error);
  }
}

module.exports = {
  name: "airhorn",
  description: "BEEEP!",
  args: false,
  usage: "",
  execute(message: Message) {
    airhorn(message);
  },
};
