import { AuditLogEvent, EmbedBuilder, GuildMember } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import fetchAuditLog from '../../functions/fetchAuditLog'

const GuildMemberRemoveLog = async (member: GuildMember) => {
  const channel = await validateLog(member.guild, 'guildMemberRemove')
  if (!channel) return

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberRemove_undefined_author', { lng: member.guild.preferredLocale, user: member.user.username }),
      iconURL: member.displayAvatarURL(),
    })
    .setDescription(`${member} (${member.user.username})`)
    .setFooter({ text: `ID: ${member.id}` })
    .setColor('Orange')
    .setTimestamp()

  const audit = await fetchAuditLog(member.guild, AuditLogEvent.MemberKick)

  if (audit?.executorId && audit.targetId === member.id) {
    embed.addFields(
      { name: t('moderator', { lng: member.guild.preferredLocale }), value: audit.executor?.toString() || 'N/A' },
      {
        name: t('reason', { lng: member.guild.preferredLocale }),
        value: audit.reason || t('reasonNotSpecified', { lng: member.guild.preferredLocale }),
      }
    )
    embed.setColor('Red')
    embed.setAuthor({ name: t('logs:guildMemberRemove_kick_author', { lng: member.guild.preferredLocale }), iconURL: member.displayAvatarURL() })
  } else {
    embed.setAuthor({ name: t('logs:guildMemberRemove_left_author', { lng: member.guild.preferredLocale }), iconURL: member.displayAvatarURL() })
  }

  channel.send({ embeds: [embed] })
}

export default GuildMemberRemoveLog
