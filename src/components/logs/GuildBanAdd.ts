import { AuditLogEvent, EmbedBuilder, GuildBan, ImageURLOptions } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import fetchAuditLog from '../../functions/fetchAuditLog'

const GuildBanAddLog = async (guildBan: GuildBan) => {
  const channel = await validateLog(guildBan.guild, 'guildBanAdd')
  if (!channel) return

  const lng = guildBan.guild.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildBanAdd_author', { lng, user: guildBan.user.username }),
      iconURL: guildBan.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setDescription(`${guildBan.user} (${guildBan.user.username})`)
    .setFooter({ text: `ID: ${guildBan.user.id}` })
    .setColor('Red')
    .setTimestamp()

  const audit = await fetchAuditLog(guildBan.guild, AuditLogEvent.MemberBanAdd)
  if (audit && audit.targetId === guildBan.user.id) {
    embed.addFields({ name: t('moderator', { lng }), value: audit.executor?.toString() || 'N/A' })
    if (audit.reason) embed.addFields({ inline: true, name: t('reason', { lng }), value: audit.reason })
  }

  channel.send({ embeds: [embed] })
}

export default GuildBanAddLog
