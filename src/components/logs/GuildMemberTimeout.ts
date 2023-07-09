import { EmbedBuilder, GuildMember } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'

const GuildMemberTimeoutLog = async (oldMember: GuildMember, newMember: GuildMember) => {
  if (newMember.user.bot) return

  if (oldMember.communicationDisabledUntil === newMember.communicationDisabledUntil) return

  const channel = await validateLog(newMember.guild, 'guildMemberTimeout')
  if (!channel) return

  if (oldMember.communicationDisabledUntil && !newMember.communicationDisabledUntil) {
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({
        name: t('logs:guildMemberTimeout_unmute_author', { lng: newMember.guild.preferredLocale, user: newMember.user.username }),
        iconURL: newMember.user.displayAvatarURL(),
      })
      .setFooter({ text: newMember.id })
      .addFields({ name: t('member', { lng: newMember.guild.preferredLocale }), value: newMember.toString() })
      .setTimestamp()

    channel.send({ embeds: [embed] })
  } else if (newMember.communicationDisabledUntil && !oldMember.communicationDisabledUntil) {
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setAuthor({
        name: t('logs:guildMemberTimeout_mute_author', { lng: newMember.guild.preferredLocale, user: newMember.user.username }),
        iconURL: newMember.user.displayAvatarURL(),
      })
      .setFooter({ text: newMember.id })
      .addFields(
        {
          name: t('member', { lng: newMember.guild.preferredLocale }),
          value: newMember.toString(),
        },
        {
          name: t('time', { lng: newMember.guild.preferredLocale }),
          value: new Date(newMember.communicationDisabledUntilTimestamp as number).toLocaleString(),
        }
      )
      .setTimestamp()
    channel.send({ embeds: [embed] })
  }
}

export default GuildMemberTimeoutLog
