import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { BotEvent } from '../@types/discord'

module.exports = (client: Client) => {
  const eventsDir = join(__dirname, '../events')

  readdirSync(eventsDir).forEach((file) => {
    const event: BotEvent = require(`${eventsDir}/${file}`).default
    event.once ? client.once(event.name, (...args) => event.execute(...args)) : client.on(event.name, (...args) => event.execute(...args))

    console.log(`[Events] Event loaded: ${event.name}`)
  })
}
