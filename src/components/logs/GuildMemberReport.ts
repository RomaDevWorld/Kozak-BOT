import { EmbedBuilder, Guild, ImageURLOptions, Message } from 'discord.js'
import { Reports } from '../context/Report'
import validateLog from '../../functions/validateLog'
import { getOnline } from '../../functions/fetchMembers'
import { t } from 'i18next'

const GuildMemberReport = async (guild: Guild, message: Message) => {
  const lng = guild.preferredLocale

  const report = Reports.get(message.author.id)
  if (!report) return

  const channel = await validateLog(guild, 'guildMemberReport')
  if (!channel) return

  let threshold = Math.floor((await getOnline(guild)) / 2)
  if (threshold < 2) threshold = 2

  const percent = Math.floor((report.members.length / threshold) * 100)

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberReport_author', { lng, author: message.author.username, value: report.members.length }),
      iconURL: message.author.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .addFields({ name: t('member', { lng }), value: message.author.toString() })
    .setTitle(t('logs:messageDelete_title', { lng }))
    .setURL(message.url)
    .setTimestamp()
    .setDescription(message.content)
  // .setFooter({ text: t('logs:guildMemberReport_footer', { lng }) })

  if (percent === 100) {
    embed.setColor('Red')
    return channel.send({ embeds: [embed] })
  }
  if (percent >= 50) {
    embed.setColor('DarkRed')
    return channel.send({ embeds: [embed] })
  }
  if (percent >= 25) {
    embed.setColor('Orange')
    return channel.send({ embeds: [embed] })
  }
}

export default GuildMemberReport
