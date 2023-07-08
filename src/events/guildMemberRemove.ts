import { GuildMember } from 'discord.js'
import { BotEvent } from '../@types/discord'
import guildMemberRemove from '../components/logs/GuildMemberRemove'

const event: BotEvent = {
  name: 'guildMemberRemove',
  once: false,
  execute: (member: GuildMember) => {
    guildMemberRemove(member)
  },
}

export default event
