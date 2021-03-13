import { MessageAttachment, MessageEmbed } from 'discord.js'

const attachments: Array<MessageAttachment> = [new MessageAttachment('./resources/memes/zerotwo.png', 'zerotwo.png')]
const zeroTwoEmbed = new MessageEmbed()

zeroTwoEmbed
	.setTitle(':P')
	.attachFiles(attachments)
	.setImage('attachment://zerotwo.png')

module.exports = {
	name: 'meme',
	args: false,
	usage: '',
	description: '',
	execute(message) {
		message.channel.send(zeroTwoEmbed)
	}
}
