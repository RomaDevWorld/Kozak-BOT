import { ChannelType, Guild, GuildMember } from 'discord.js'
import Modules, { logTypes } from '../schemas/Modules'

const validateLog = async (guild: Guild, type: keyof typeof logTypes, relChannelIds?: string[], relMember?: GuildMember) => {
  const data = await Modules.findOne({ guildId: guild?.id })
  if (!data || !data.log?.channel) return

  if (!data.log.types?.[type]) return

  const channel = guild?.channels.cache.get(data.log.channel)
  if (!channel) return

  if (!channel.permissionsFor(guild?.members.me as GuildMember).has(['SendMessages', 'ViewChannel']) || channel.type !== ChannelType.GuildText) return

  const ignoredChannels = data.log.ignoredChannels
  const ignoredRoles = data.log.ignoredRoles
  const memberRoles = relMember?.roles.cache.map((role) => role.id)

  if (ignoredChannels.some((channel) => relChannelIds?.includes(channel))) return
  if (memberRoles?.some((role) => ignoredRoles.includes(role))) return

  return channel
}

export default validateLog
