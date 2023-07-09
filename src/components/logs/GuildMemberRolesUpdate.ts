import { EmbedBuilder, GuildMember } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'

const GuildMemberRolesUpdateLog = async (oldMember: GuildMember, newMember: GuildMember) => {
  if (newMember.user.bot) return

  const oldRoles = oldMember.roles.cache.map((role) => role.id)
  const newRoles = newMember.roles.cache.map((role) => role.id)

  const addedRoles = newMember.roles.cache.filter((role) => !oldRoles.includes(role.id))
  const removedRoles = oldMember.roles.cache.filter((role) => !newRoles.includes(role.id))

  if (addedRoles.size === 0 && removedRoles.size === 0) return

  const channel = await validateLog(newMember.guild, 'guildMemberRolesUpdate')
  if (!channel) return

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberRolesUpdate_author', { lng: newMember.guild.preferredLocale, user: newMember.user.username }),
      iconURL: newMember.user.displayAvatarURL(),
    })
    .setColor('Yellow')
    .setFooter({ text: `ID: ${newMember.id}` })
    .setTimestamp()

  if (addedRoles.size > 0)
    embed.addFields({
      name: t('logs:guildMemberRolesUpdate_field1', { lng: newMember.guild.preferredLocale }),
      value: addedRoles.map((role) => role.toString()).join('\n'),
    })
  if (removedRoles.size > 0)
    embed.addFields({
      name: t('logs:guildMemberRolesUpdate_field2', { lng: newMember.guild.preferredLocale }),
      value: removedRoles.map((role) => role.toString()).join('\n'),
    })

  channel.send({ embeds: [embed] })
}

export default GuildMemberRolesUpdateLog
