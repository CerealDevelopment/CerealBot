import { Message } from 'discord.js'

module.exports = {
    name: 'cereal',
    description: 'A really cereal message!',
    args: false,
    usage: '',
    execute(message: Message) {
        message.channel.send('Some Cereal stuff happening soon! (╯°□°）╯︵ ┻━┻');
    }
}