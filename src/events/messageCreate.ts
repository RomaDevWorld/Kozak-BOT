import { Message } from 'discord.js'
import { BotEvent } from '../@types/discord'
import { addXp } from '../functions/useXp'

const event: BotEvent = {
  name: 'messageCreate',
  once: false,
  execute: (message: Message) => {
    addXp(message)
  },
}

export default event
