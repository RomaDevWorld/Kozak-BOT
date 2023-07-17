import { GuildMember, PermissionFlagsBits, Role } from 'discord.js'
import Modules from '../schemas/Modules'
import RestoreRoles from '../schemas/RestoreRoles'
import moment from 'moment'

export const handleAutoRoles = async (member: GuildMember) => {
  const data = await Modules.findOne({ guildId: member.guild.id })

  const autoRole = member.guild.roles.cache.get(data?.roles.autorole as string)
  if (autoRole && !autoRole.managed && !autoRole.permissions.has(PermissionFlagsBits.Administrator))
    member.roles.add(autoRole).catch((err) => console.error(err))

  if (!data?.roles.restore.status) return
  const restore = await RestoreRoles.findOne({ guildId: member.guild.id, userId: member.id })
  await RestoreRoles.deleteOne({ guildId: member.guild.id, userId: member.id })

  if (!restore || moment(restore.updatedAt).add(data.roles.restore.expireTime).unix() >= Date.now()) return

  if (restore.roles.length > 0) {
    const roles = restore.roles.map((id) => member.guild.roles.cache.get(id)) as Role[]
    const filteredRoles = roles.filter((role) => role && !role.managed && !role.permissions.has(PermissionFlagsBits.Administrator))
    if (filteredRoles.length > 0) member.roles.add(filteredRoles).catch((err) => console.error(err))
  }
  if (restore.nickname) member.setNickname(restore.nickname)
}

export const saveRolesToRestore = async (member: GuildMember) => {
  await RestoreRoles.findOneAndUpdate(
    { guildId: member.guild.id, userId: member.id },
    {
      roles: member.roles.cache
        .filter((role) => !role.permissions.has(PermissionFlagsBits.Administrator) && role.id !== member.guild.id)
        .map((role) => role.id),
      nickname: member.nickname,
    },
    { upsert: true, new: true }
  )
}
