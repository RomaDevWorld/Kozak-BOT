import { GuildMember } from 'discord.js'
import { BotEvent } from '../@types/discord'
import guildMemberAdd from '../components/logs/GuildMemberAdd'

const event: BotEvent = {
  name: 'guildMemberAdd',
  once: false,
  execute: (member: GuildMember) => {
    guildMemberAdd(member)
  },
}

export default event
