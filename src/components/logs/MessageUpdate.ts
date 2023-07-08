import { EmbedBuilder, Message } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'

const MessageUpdateLog = async (oldMessage: Message, newMessage: Message) => {
  if (newMessage.author.bot) return
  const channel = await validateLog(newMessage.guild, 'messageUpdate')

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:messageUpdate_author', { lng: newMessage.guild?.preferredLocale, user: newMessage.author.username }),
      iconURL: newMessage.author.displayAvatarURL(),
    })
    .setTitle(t('logs:messageUpdate_title', { lng: newMessage.guild?.preferredLocale }))
    .setURL(newMessage.url)
    .addFields(
      { name: t('logs:messageUpdate_field1', { lng: newMessage.guild?.preferredLocale }), value: oldMessage.content || 'N/A' },
      { name: t('logs:messageUpdate_field2', { lng: newMessage.guild?.preferredLocale }), value: newMessage.content || 'N/A' },
      { name: t('author', { lng: newMessage.guild?.preferredLocale }), value: newMessage.author.toString(), inline: true },
      { name: t('channel', { lng: newMessage.guild?.preferredLocale }), value: newMessage.channel.toString(), inline: true }
    )
    .setFooter({ text: `ID: ${newMessage.author.id}` })
    .setColor('Blue')
    .setTimestamp()

  channel?.send({ embeds: [embed] })
}

export default MessageUpdateLog
