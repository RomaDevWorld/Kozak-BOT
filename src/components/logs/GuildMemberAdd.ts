import { EmbedBuilder, GuildMember, ImageURLOptions } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import moment from 'moment'

const GuildMemberAddLog = async (member: GuildMember) => {
  const channel = await validateLog(member.guild, 'guildMemberAdd')
  if (!channel) return

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberAdd_embed_author', { lng: member.guild.preferredLocale, user: member.user.username }),
      iconURL: member.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setDescription(
      `${member} (${member.user.username})\n${t('logs:guildMemberAdd_embed_description', { lng: member.guild.preferredLocale })}\n${moment(
        member.user.createdAt
      ).format('YYYY.DD.MM HH:mm')}`
    )
    .setFooter({ text: `ID: ${member.id}` })
    .setColor('Green')
    .setTimestamp()

  channel.send({ embeds: [embed] })
}

export default GuildMemberAddLog
