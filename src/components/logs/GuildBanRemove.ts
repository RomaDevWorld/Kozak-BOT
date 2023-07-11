import { AuditLogEvent, EmbedBuilder, GuildBan } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import fetchAuditLog from '../../functions/fetchAuditLog'

const GuildBanRemoveLog = async (guildBan: GuildBan) => {
  const channel = await validateLog(guildBan.guild, 'guildBanAdd')
  if (!channel) return

  const lng = guildBan.guild.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildBanRemove_author', { lng, user: guildBan.user.username }),
      iconURL: guildBan.user.displayAvatarURL(),
    })
    .setDescription(`${guildBan.user} (${guildBan.user.username})`)
    .setFooter({ text: `ID: ${guildBan.user.id}` })
    .setColor('Green')
    .setTimestamp()

  const audit = await fetchAuditLog(guildBan.guild, AuditLogEvent.MemberBanRemove)
  if (audit && audit.targetId === guildBan.user.id) {
    embed.addFields({ name: t('moderator', { lng }), value: audit.executor?.toString() || 'N/A' })
    if (audit.reason) embed.addFields({ inline: true, name: t('reason', { lng }), value: audit.reason })
  }

  channel.send({ embeds: [embed] })
}

export default GuildBanRemoveLog
