import { Message } from 'discord.js'
import { BotEvent } from '../@types/discord'
import MessageDeleteLog from '../components/logs/MessageDelete'

const event: BotEvent = {
  name: 'messageDelete',
  once: false,
  execute: (message: Message) => {
    MessageDeleteLog(message)
  },
}

export default event
