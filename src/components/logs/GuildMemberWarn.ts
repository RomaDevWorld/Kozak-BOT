import { EmbedBuilder, GuildMember, ImageURLOptions } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'

const GuildMemberWarnLog = async (member: GuildMember, mod: GuildMember, total: number, reason?: string | null) => {
  const channel = await validateLog(member.guild, 'guildMemberWarn', undefined, member)
  if (!channel) return

  const lng = member.guild.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberWarn.author', { lng, user: member.user.username }),
      iconURL: member.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .addFields(
      { name: t('member_one', { lng }), value: member.toString(), inline: true },
      { name: t('moderator', { lng }), value: mod.toString(), inline: true },
      { name: t('reason', { lng }), value: reason || t('reasonNotSpecified', { lng }) }
    )
    .setFooter({ text: `ID: ${member.id} | ${t('warn.list.embed_footer', { lng, value: total })}` })
    .setColor('Orange')
    .setTimestamp()

  channel.send({ embeds: [embed] })
}

export default GuildMemberWarnLog
