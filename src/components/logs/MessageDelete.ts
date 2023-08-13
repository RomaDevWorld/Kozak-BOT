import { EmbedBuilder, GuildChannel, ImageURLOptions, Message } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import parseMessageAttachments from '../../functions/parseMessageAttachments'

const MessageDeleteLog = async (message: Message) => {
  if (message.author.bot) return
  const channel = await validateLog(message.guild, 'messageDelete')
  if (!channel) return

  const lng = message.guild?.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:messageDelete.author', { lng, user: message.author.username }),
      iconURL: message.author.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setURL(message.url)
    .addFields(
      { name: t('author', { lng }), value: message.author.toString(), inline: true },
      { name: t('channel_one', { lng }), value: `${message.channel.toString()} (#${(message.channel as GuildChannel).name})`, inline: true }
    )
    .setFooter({ text: `ID: ${message.author.id}` })
    .setColor('Red')
    .setTimestamp()

  if (message.content) embed.setDescription(message.content)
  if (message.attachments.size > 0) {
    embed.addFields({
      name: t('attachment', { lng, count: message.attachments.size }),
      value: parseMessageAttachments(message.attachments) || t('none', { lng }),
    })
  }

  channel.send({ embeds: [embed] })
}

export default MessageDeleteLog
