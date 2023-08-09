import { EmbedBuilder, GuildChannel, ImageURLOptions, Message } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import parseMessageAttachments from '../../functions/parseMessageAttachments'

const MessageUpdateLog = async (oldMessage: Message, newMessage: Message) => {
  if (newMessage.author.bot) return
  const channel = await validateLog(newMessage.guild, 'messageUpdate')
  if (!channel) return

  const lng = newMessage.guild?.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:messageUpdate.author', { lng: newMessage.guild?.preferredLocale, user: newMessage.author.username }),
      iconURL: newMessage.author.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setTitle(t('logs:messageUpdate.title', { lng: newMessage.guild?.preferredLocale }))
    .setURL(newMessage.url)
    .addFields(
      { name: t('before', { lng: newMessage.guild?.preferredLocale }), value: oldMessage.content || t('none', { lng }) },
      { name: t('now', { lng: newMessage.guild?.preferredLocale }), value: newMessage.content || t('none', { lng }) },
      { name: t('author', { lng: newMessage.guild?.preferredLocale }), value: newMessage.author.toString(), inline: true },
      {
        name: t('channel_one', { lng: newMessage.guild?.preferredLocale }),
        value: `${newMessage.channel.toString()} (#${(newMessage.channel as GuildChannel).name})`,
        inline: true,
      }
    )
    .setFooter({ text: `ID: ${newMessage.author.id}` })
    .setColor('Blue')
    .setTimestamp()

  if (oldMessage.attachments.size > 0 || newMessage.attachments.size > 0) {
    const embedLines = [
      `**${t('logs:messageUpdate.oldAttach')}:**`,
      parseMessageAttachments(oldMessage.attachments) || t('none', { lng }),
      `**${t('logs:messageUpdate.newAttach')}:`,
      parseMessageAttachments(newMessage.attachments) || t('none', { lng }),
    ]
    embed.addFields({ name: t('attachment_other', { lng }), value: embedLines.join('\n') })
  }

  channel.send({ embeds: [embed] })
}

export default MessageUpdateLog
