import { GuildMember } from 'discord.js'
import { BotEvent } from '../@types/discord'
import GuildMemberAddLog from '../components/logs/GuildMemberAdd'
import { handleAutoRoles } from '../functions/handleAutoRoles'

const event: BotEvent = {
  name: 'guildMemberAdd',
  once: false,
  execute: (member: GuildMember) => {
    GuildMemberAddLog(member)
    handleAutoRoles(member)
  },
}

export default event
