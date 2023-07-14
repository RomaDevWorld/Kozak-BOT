import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { BotEvent } from '../@types/discord'

module.exports = (client: Client) => {
  const eventsDir = join(__dirname, '../events')

  readdirSync(eventsDir).forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event: BotEvent = require(`${eventsDir}/${file}`).default
    event.once ? client.once(event.name, (...args) => event.execute(...args)) : client.on(event.name, (...args) => event.execute(...args))
    // eslint-disable-next-line no-console
    console.log(`[Events] Event loaded: ${event.name}`)
  })
}
