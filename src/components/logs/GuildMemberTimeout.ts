import { AuditLogEvent, EmbedBuilder, GuildMember, ImageURLOptions } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import fetchAuditLog from '../../functions/fetchAuditLog'

const GuildMemberTimeoutLog = async (oldMember: GuildMember, newMember: GuildMember) => {
  if (newMember.user.bot) return

  if (oldMember.communicationDisabledUntil === newMember.communicationDisabledUntil) return

  const channel = await validateLog(newMember.guild, 'guildMemberTimeout')
  if (!channel) return

  let audit = await fetchAuditLog(newMember.guild, AuditLogEvent.MemberUpdate)
  if (audit?.targetId !== newMember.id || audit?.changes[0].key !== 'communication_disabled_until') audit = undefined

  const lng = newMember.guild.preferredLocale

  if (oldMember.communicationDisabledUntil && !newMember.communicationDisabledUntil) {
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({
        name: t('logs:guildMemberTimeout.unmute_author', { lng, user: newMember.user.username }),
        iconURL: newMember.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
      })
      .setFooter({ text: newMember.id })
      .addFields({ name: t('member_one', { lng }), value: newMember.toString() })
      .setTimestamp()
    if (audit)
      embed.addFields(
        { name: t('moderator', { lng }), value: audit.executor?.toString() || t('none', { lng }) },
        { name: t('reason', { lng }), value: audit.reason || t('reasonNotSpecified', { lng }) }
      )

    channel.send({ embeds: [embed] })
  } else if (newMember.communicationDisabledUntil && !oldMember.communicationDisabledUntil) {
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setAuthor({
        name: t('logs:guildMemberTimeout.mute_author', { lng, user: newMember.user.username }),
        iconURL: newMember.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
      })
      .setFooter({ text: newMember.id })
      .addFields(
        {
          name: t('member_one', { lng }),
          value: newMember.toString(),
        },
        {
          name: t('time', { lng }),
          value: new Date(newMember.communicationDisabledUntilTimestamp as number).toLocaleString(),
        }
      )
      .setTimestamp()
    if (audit)
      embed.addFields(
        { name: t('moderator', { lng }), value: audit.executor?.toString() || t('none', { lng }) },
        { name: t('reason', { lng }), value: audit.reason || t('reasonNotSpecified', { lng }) }
      )
    channel.send({ embeds: [embed] })
  }
}

export default GuildMemberTimeoutLog
