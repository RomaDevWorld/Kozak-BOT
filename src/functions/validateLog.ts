import { ChannelType, Guild, GuildMember } from 'discord.js'
import Modules from '../schemas/Modules'

type LogTypes = 'messageDelete' | 'messageUpdate'

const validateLog = async (guild: Guild | null, type: LogTypes) => {
  const data = await Modules.findOne({ guildId: guild?.id })
  if (!data || !data.log.channel) return

  if (!data.log.types[type]) return

  const channel = guild?.channels.cache.get(data.log.channel as string)
  if (!channel) return

  if (!channel.permissionsFor(guild?.members.me as GuildMember).has(['SendMessages', 'ViewChannel']) || channel.type !== ChannelType.GuildText) return

  return channel
}

export default validateLog
