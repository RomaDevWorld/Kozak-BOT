import { GuildMember } from 'discord.js'
import { BotEvent } from '../@types/discord'
import GuildMemberRolesUpdateLog from '../components/logs/GuildMemberRolesUpdate'
import GuildMemberNicknameUpdateLog from '../components/logs/GuildMemberNicknameUpdate'
import GuildMemberTimeoutLog from '../components/logs/GuildMemberTimeout'

const event: BotEvent = {
  name: 'guildMemberUpdate',
  once: false,
  execute: (oldMember: GuildMember, newMember: GuildMember) => {
    GuildMemberRolesUpdateLog(oldMember, newMember)
    GuildMemberNicknameUpdateLog(oldMember, newMember)
    GuildMemberTimeoutLog(oldMember, newMember)
  },
}

export default event
