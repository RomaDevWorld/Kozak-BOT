import { GuildBan } from 'discord.js'
import { BotEvent } from '../@types/discord'
import GuildBanAdd from '../components/logs/GuildBanAdd'

const event: BotEvent = {
  name: 'guildBanAdd',
  once: false,
  execute: (guildBan: GuildBan) => {
    GuildBanAdd(guildBan)
  },
}

export default event
