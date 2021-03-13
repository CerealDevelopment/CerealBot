import fs from "fs";
import { Message } from "discord.js";


async function airhorn(message: Message) {
    if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
                
        // Create a dispatcher
        const dispatcher = connection.play(fs.createReadStream('./resources/sounds/airhorn_default.wav'), {type: 'unknown'});

        dispatcher.setVolume(1);

        dispatcher.on('start', () => {
          console.log('airhorn_default.wav is now playing!');
        });

        dispatcher.on('finish', () => {
          console.log('airhorn_default.wav has finished playing!');
          dispatcher.destroy();
          connection.disconnect();
        });

        // Always remember to handle errors appropriately!
        dispatcher.on('error', console.error);
      }
}

export default {
    airhorn
}