import { GuildMember } from 'discord.js'
import Modules from '../schemas/Modules'

const handleAutoRoles = async (member: GuildMember) => {
  const data = await Modules.findOne({ guildId: member.guild.id })

  const autoRole = member.guild.roles.cache.get(data?.roles.autorole as string)
  if (autoRole && !autoRole.managed && !autoRole.permissions.has('Administrator')) member.roles.add(autoRole).catch((err) => console.error(err))
}

export default handleAutoRoles
