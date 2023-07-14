import { Client } from 'discord.js'
import { BotEvent } from '../@types/discord'

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: (client: Client) => {
    // eslint-disable-next-line no-console
    console.log(`[Discord Ready] Logged in as ${client.user?.tag}`)
  },
}

export default event
