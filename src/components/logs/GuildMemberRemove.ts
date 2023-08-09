import { AuditLogEvent, EmbedBuilder, GuildMember, ImageURLOptions } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import fetchAuditLog from '../../functions/fetchAuditLog'

const GuildMemberRemoveLog = async (member: GuildMember) => {
  const isBanned = member.guild.bans.cache.find((ban) => ban.user.id === member.id)
  if (isBanned) return

  const channel = await validateLog(member.guild, 'guildMemberRemove')
  if (!channel) return

  const lng = member.guild.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberRemove_undefined_author', { lng, user: member.user.username }),
      iconURL: member.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setDescription(`${member} (${member.user.username})`)
    .setFooter({ text: `ID: ${member.id}` })
    .setColor('Orange')
    .setTimestamp()

  const audit = await fetchAuditLog(member.guild, AuditLogEvent.MemberKick)

  if (audit?.executorId && audit.targetId === member.id) {
    embed.addFields(
      { name: t('moderator', { lng }), value: audit.executor?.toString() || t('none', { lng }) },
      {
        name: t('reason', { lng }),
        value: audit.reason || t('reasonNotSpecified', { lng }),
      }
    )
    embed.setColor('Red')
    embed.setAuthor({ name: t('logs:guildMemberRemove_kick_author', { lng }), iconURL: member.displayAvatarURL() })
  } else {
    embed.setAuthor({ name: t('logs:guildMemberRemove_left_author', { lng }), iconURL: member.displayAvatarURL() })
  }

  channel.send({ embeds: [embed] })
}

export default GuildMemberRemoveLog
