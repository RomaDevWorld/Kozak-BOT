import { EmbedBuilder, ImageURLOptions, Message } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'

const MessageDeleteLog = async (message: Message) => {
  if (message.author.bot) return
  const channel = await validateLog(message.guild, 'messageDelete')
  if (!channel) return

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:messageDelete_author', { lng: message.guild?.preferredLocale, user: message.author.username }),
      iconURL: message.author.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setURL(message.url)
    .setDescription(message.content || 'N/A')
    .addFields(
      { name: t('author', { lng: message.guild?.preferredLocale }), value: message.author.toString(), inline: true },
      { name: t('channel', { lng: message.guild?.preferredLocale }), value: message.channel.toString(), inline: true }
    )
    .setFooter({ text: `ID: ${message.author.id}` })
    .setColor('Red')
    .setTimestamp()

  channel.send({ embeds: [embed] })
}

export default MessageDeleteLog
