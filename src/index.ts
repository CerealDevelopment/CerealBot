import _ from 'lodash'
import cron from 'node-cron'
import knex from './data/database'
import logger from './logging'
import { Client, ClientOptions, Message, Options, Intents } from 'discord.js'
import { CommandInterface, getCommandMap } from './utils'
import { DISCORD, DATABASE, MEME } from '../config.json'
import {
  clearDatabaseAndSyncWithImgur,
  isMemeDatabaseEmpty
} from './data/memeDataAccess'
import { getPrefixSetIfEmpty } from './data/prefixDataAccess'

const globalPrefix: string = DISCORD.PREFIX ?? '!'

const BOT_TOKEN: string = process.env.BOT_TOKEN ?? DISCORD.BOT_TOKEN
const client: Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_TYPING
  ],
  token: BOT_TOKEN,
  makeCache: Options.cacheWithLimits({
    MessageManager: 200, // This is default
    PresenceManager: 0
    // Add more class names here
  })
} as ClientOptions)

// TODO Move also into module or at least move the imgur part into one function e.g. clearAndInitImgur
knex.migrate
  .latest({ directory: DATABASE.PATH_TO_MIGRATION_FILES })
  .then(isMemeDatabaseEmpty)
  .then(isEmpty => {
    if (isEmpty) {
      clearDatabaseAndSyncWithImgur()
    }
  })
  .catch(e => {
    logger.error(e)
    process.exit(1)
  })

client.login(BOT_TOKEN).catch((e: Error) => {
  logger.error(`The 'BOT_TOKEN' is missing.\n${e.stack}`)
  process.exit(1)
})

const checkRights = (message: Message, rights: any): boolean => {
  const user = message.member
  rights.forEach(right => {
    if (user.permissions.has(right)) return true
  })
  return false
}

const executeCommand = (
  message: Message,
  prefix: string,
  command: string,
  args: string[]
) => {
  const executable: CommandInterface = getCommandMap().get(command)
  if (executable !== undefined) {
    if (executable.neededUserPermissions !== undefined) {
      if (executable.neededUserPermissions.length != 0) {
        if (!checkRights(message, executable.neededUserPermissions)) {
          message.channel.send('You are not allowed to run the command')
          throw new Error(`${message.author.id} got an error on '${command}'`)
        }
      }
    }
  }

  if (executable.hasArgs && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (executable.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${executable.name} ${executable.usage}\``
    }
    message.channel.send(reply)
  } else {
    executable.execute(message, args)
  }
}

client.once('ready', () => {
  logger.info('Time to get cereal!')
})

cron.schedule(MEME.SYNC_AT_MIDNIGHT, async () => {
  logger.info('Run meme sync job')
  await clearDatabaseAndSyncWithImgur()
})

client.on('message', async (message: Message) => {
  const prefix: string = await getPrefixSetIfEmpty(
    message.guild.id,
    globalPrefix
  ).catch(e => {
    logger.error(e)
  })

  if (!message.content.startsWith(prefix) || message.author.bot) {
    if (_.isEqual(_.trim(message.content.toLocaleLowerCase()), 'prefix')) {
      message.reply(`Prefix is '${prefix}'`)
    }
    return
  }

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/)
  const command = args.shift().toLocaleLowerCase()
  logger.info(
    `Called '${command}' by '${message.author.id}' in '${message.guild.id}'`
  )
  const executedCommand = _.attempt(
    executeCommand,
    message,
    prefix,
    command,
    args
  )

  if (_.isError(executedCommand)) {
    logger.error(executedCommand)
    message.reply(
      `I'm sorry, but your command is unknown. Please type \`${prefix}help\` for a list of all featured commands.`
    )
  }
})
