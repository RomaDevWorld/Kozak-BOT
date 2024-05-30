import { Client } from 'discord.js'
import Modules from '../schemas/Modules'
import RestoreRoles from '../schemas/RestoreRoles'
import Privates from '../schemas/Privates'
import { ChannelType } from 'discord.js'

const cleanUp = async (client: Client) => {
   
  console.time('Clean up')

  const guildModules = await Modules.find({})

  const guildIdsToDelete = guildModules.filter((guild) => !client.guilds.cache.has(guild.guildId)).map((guild) => guild.guildId)

  await Modules.deleteMany({ guildId: { $in: guildIdsToDelete } })
    .then((res) => console.warn(`Cleaned up ${res.deletedCount} modules`))
    .catch((err) => console.error(err))

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  await RestoreRoles.deleteMany({ $or: [{ guildId: { $in: guildIdsToDelete } }, { updatedAt: { $lte: thirtyDaysAgo } }] })
    .then((res) => console.warn(`Cleaned up ${res.deletedCount} restore roles`))
    .catch((err) => console.error(err))

  const activePrivates = await Privates.find({})
  const privatesToDelete: string[] = []
  activePrivates.forEach((i) => {
    const channel = client.channels.cache.get(i.channelId)
    if (!channel) privatesToDelete.push(i.channelId)
    if (channel && channel.type === ChannelType.GuildVoice && channel.members.size === 0) {
      channel.delete().catch((err) => console.error(`Error while cleaning privates: ${err.message}`))
      privatesToDelete.push(channel.id)
    }
  })

  await Privates.deleteMany({ $or: [{ guildId: { $in: guildIdsToDelete } }, { channelId: { $in: privatesToDelete } }] })
    .then((res) => console.warn(`Cleaned up ${res.deletedCount} privates`))
    .catch((err) => console.error(err))

   
  console.timeEnd('Clean up')
}

export default cleanUp
