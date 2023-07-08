import { GuildMember } from 'discord.js'
import { BotEvent } from '../@types/discord'
import GuildMemberAddLog from '../components/logs/GuildMemberAdd'

const event: BotEvent = {
  name: 'guildMemberAdd',
  once: false,
  execute: (member: GuildMember) => {
    GuildMemberAddLog(member)
  },
}

export default event
