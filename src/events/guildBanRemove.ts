import { GuildBan } from 'discord.js'
import { BotEvent } from '../@types/discord'
import GuildBanRemove from '../components/logs/GuildBanRemove'

const event: BotEvent = {
  name: 'guildBanRemove',
  once: false,
  execute: (guildBan: GuildBan) => {
    GuildBanRemove(guildBan)
  },
}

export default event
