import { AuditLogEvent, EmbedBuilder, GuildMember } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import fetchAuditLog from '../../functions/fetchAuditLog'

const GuildMemberNicknameUpdateLog = async (oldMember: GuildMember, newMember: GuildMember) => {
  if (newMember.user.bot) return

  if (newMember.nickname === oldMember.nickname) return

  const channel = await validateLog(newMember.guild, 'guildMemberNicknameUpdate')
  if (!channel) return

  const lng = newMember.guild.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberNicknameUpdate_author', { lng, user: newMember.user.username }),
      iconURL: newMember.displayAvatarURL(),
    })
    .addFields(
      {
        name: t('member', { lng }),
        value: newMember.toString(),
      },
      {
        name: t('before', { lng }),
        value: oldMember.nickname || 'N/A',
        inline: true,
      },
      {
        name: t('now', { lng }),
        value: newMember.nickname || 'N/A',
        inline: true,
      }
    )
    .setFooter({ text: `ID: ${newMember.id}` })
    .setColor('Blue')
    .setTimestamp()

  const audit = await fetchAuditLog(newMember.guild, AuditLogEvent.MemberUpdate)
  if (audit && audit.targetId === newMember.id) {
    embed.addFields({ name: t('executor', { lng }), value: audit.executor?.toString() || 'N/A' })
    if (audit.reason) embed.addFields({ inline: true, name: t('reason', { lng }), value: audit.reason || 'N/A' })
  }

  channel.send({ embeds: [embed] })
}

export default GuildMemberNicknameUpdateLog
