import { EmbedBuilder, GuildMember } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'

const GuildMemberNicknameUpdateLog = async (oldMember: GuildMember, newMember: GuildMember) => {
  if (newMember.user.bot) return

  if (newMember.nickname === oldMember.nickname) return

  const channel = await validateLog(newMember.guild, 'guildMemberNicknameUpdate')
  if (!channel) return

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberNicknameUpdate_author', { lng: newMember.guild.preferredLocale, user: newMember.user.username }),
      iconURL: newMember.displayAvatarURL(),
    })
    .addFields(
      {
        name: t('member', { lng: newMember.guild.preferredLocale }),
        value: newMember.toString(),
      },
      {
        name: t('before', { lng: newMember.guild.preferredLocale }),
        value: oldMember.nickname || 'N/A',
        inline: true,
      },
      {
        name: t('now', { lng: newMember.guild.preferredLocale }),
        value: newMember.nickname || 'N/A',
        inline: true,
      }
    )
    .setFooter({ text: `ID: ${newMember.id}` })
    .setColor('Blue')
    .setTimestamp()

  channel.send({ embeds: [embed] })
}

export default GuildMemberNicknameUpdateLog
