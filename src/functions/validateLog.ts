import { ChannelType, Guild, GuildMember } from 'discord.js'
import Modules, { logTypes } from '../schemas/Modules'

const validateLog = async (guild: Guild | null, type: keyof typeof logTypes) => {
  const data = await Modules.findOne({ guildId: guild?.id })
  if (!data || !data.log?.channel) return

  if (!data.log.types?.[type]) return

  const channel = guild?.channels.cache.get(data.log.channel)
  if (!channel) return

  if (!channel.permissionsFor(guild?.members.me as GuildMember).has(['SendMessages', 'ViewChannel']) || channel.type !== ChannelType.GuildText) return

  return channel
}

export default validateLog
