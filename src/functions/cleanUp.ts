import { Client } from 'discord.js'
import Modules from '../schemas/Modules'
import RestoreRoles from '../schemas/RestoreRoles'
import Privates from '../schemas/Privates'

const cleanUp = async (client: Client) => {
  // eslint-disable-next-line no-console
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

  await Privates.deleteMany({ guildId: { $in: guildIdsToDelete } })
    .then((res) => console.warn(`Cleaned up ${res.deletedCount} privates`))
    .catch((err) => console.error(err))

  // eslint-disable-next-line no-console
  console.timeEnd('Clean up')
}

export default cleanUp
