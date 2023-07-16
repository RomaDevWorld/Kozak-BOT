import { Guild } from 'discord.js'
import { BotEvent } from '../@types/discord'
import { cacheOne } from '../functions/trackInvites'

const event: BotEvent = {
  name: 'guildCreate',
  once: false,
  execute: (guild: Guild) => {
    cacheOne(guild)
  },
}

export default event
