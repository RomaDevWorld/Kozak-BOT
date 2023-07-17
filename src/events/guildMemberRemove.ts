import { GuildMember } from 'discord.js'
import { BotEvent } from '../@types/discord'
import GuildMemberRemoveLog from '../components/logs/GuildMemberRemove'
import { saveRolesToRestore } from '../functions/handleAutoRoles'

const event: BotEvent = {
  name: 'guildMemberRemove',
  once: false,
  execute: (member: GuildMember) => {
    GuildMemberRemoveLog(member)
    saveRolesToRestore(member)
  },
}

export default event
