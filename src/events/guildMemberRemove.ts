import { GuildMember } from 'discord.js'
import { BotEvent } from '../@types/discord'
import GuildMemberRemoveLog from '../components/logs/GuildMemberRemove'

const event: BotEvent = {
  name: 'guildMemberRemove',
  once: false,
  execute: (member: GuildMember) => {
    GuildMemberRemoveLog(member)
  },
}

export default event
