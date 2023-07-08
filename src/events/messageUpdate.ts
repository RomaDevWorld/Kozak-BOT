import { Message } from 'discord.js'
import { BotEvent } from '../@types/discord'
import MessageUpdateLog from '../components/logs/MessageUpdate'

const event: BotEvent = {
  name: 'messageUpdate',
  once: false,
  execute: (oldMessage: Message, newMessage: Message) => {
    MessageUpdateLog(oldMessage, newMessage)
  },
}

export default event
