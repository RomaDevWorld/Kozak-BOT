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
      name: t('logs:messageDelete_author', { lng, user: message.author.username }),
      iconURL: message.author.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setURL(message.url)
    .setDescription(message.content || t('none', { lng }))
    .addFields(
      { name: t('author', { lng }), value: message.author.toString(), inline: true },
      { name: t('channel_one', { lng }), value: `${message.channel.toString()} (#${(message.channel as GuildChannel).name})`, inline: true }
    )
    .setFooter({ text: `ID: ${message.author.id}` })
    .setColor('Red')
    .setTimestamp()

  if (message.attachments.size > 0)
    embed.addFields({
      name: t('attachment', { lng, value: message.attachments.size }),
      value: parseMessageAttachments(message.attachments) || t('error', { lng }),
    })

  channel.send({ embeds: [embed] })
}

export default MessageDeleteLog
