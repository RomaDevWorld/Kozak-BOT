import { AuditLogEvent, EmbedBuilder, GuildMember, ImageURLOptions } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import fetchAuditLog from '../../functions/fetchAuditLog'

const GuildMemberRolesUpdateLog = async (oldMember: GuildMember, newMember: GuildMember) => {
  if (newMember.user.bot) return

  const oldRoles = oldMember.roles.cache.map((role) => role.id)
  const newRoles = newMember.roles.cache.map((role) => role.id)

  const addedRoles = newMember.roles.cache.filter((role) => !oldRoles.includes(role.id))
  const removedRoles = oldMember.roles.cache.filter((role) => !newRoles.includes(role.id))

  if (addedRoles.size === 0 && removedRoles.size === 0) return

  const channel = await validateLog(newMember.guild, 'guildMemberRolesUpdate')
  if (!channel) return

  const lng = newMember.guild.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberRolesUpdate.author', { lng, user: newMember.user.username }),
      iconURL: newMember.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setColor('Yellow')
    .setFooter({ text: `ID: ${newMember.id}` })
    .setTimestamp()

  if (addedRoles.size > 0)
    embed.addFields({
      name: t('logs:guildMemberRolesUpdate.field1', { lng }),
      value: addedRoles.map((role) => role.toString()).join('\n'),
    })
  if (removedRoles.size > 0)
    embed.addFields({
      name: t('logs:guildMemberRolesUpdate.field2', { lng }),
      value: removedRoles.map((role) => role.toString()).join('\n'),
    })

  const audit = await fetchAuditLog(newMember.guild, AuditLogEvent.MemberRoleUpdate)
  if (audit && audit.targetId === newMember.id) {
    embed.addFields({ name: t('executor', { lng }), value: audit.executor?.toString() || t('none', { lng }) })
    if (audit.reason) embed.addFields({ inline: true, name: t('reason', { lng }), value: audit.reason })
  }

  channel.send({ embeds: [embed] })
}

export default GuildMemberRolesUpdateLog
