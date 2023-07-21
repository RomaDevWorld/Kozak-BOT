import { AttachmentBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import { Button } from '../../@types/discord'
import { t } from 'i18next'
import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs'
import moment from 'moment'

const CloseTicket: Button = {
  button: new ButtonBuilder().setCustomId('close_ticket').setEmoji('🔒').setStyle(ButtonStyle.Danger),
  async execute(interaction) {
    const channel = interaction.channel as TextChannel
    if (!channel) return

    channel.permissionOverwrites.cache.forEach((i) =>
      i.channel.permissionOverwrites.edit(i.id, {
        SendMessages: false,
      })
    )
    // channel.setName(`archive-` + channel.name)

    // interaction.message.edit({ components: [] })

    const messages = await channel.messages.fetch()
    const ticketCreatedAt = messages.last()?.createdTimestamp

    const messageHistory = messages
      .reverse()
      .filter((m) => !m.author.bot)
      .map((m) => {
        return (
          `${m.author.username} (ID: ${m.author.id}): ${m.content}\n` + `${m.attachments.size > 0 ? m.attachments.map((i) => i.url).join('\n') : ''}`
        )
      })
      .join('\n')

    if (messageHistory.length <= 0) return

    const cacheDir = './.cache'
    if (!existsSync(cacheDir)) mkdirSync(cacheDir)

    const filePath = `./.cache/${Date.now()}.log`

    const stream = createWriteStream(filePath)

    stream.write(`[Start ${moment(ticketCreatedAt).format(`DD.MM.YYYY HH:mm`)}]\n`)
    stream.write(messageHistory)
    stream.write(`\n[Close ${moment(Date.now()).format(`DD.MM.YYYY HH:mm`)} by user ${interaction.user.username} (ID: ${interaction.user.id})]`)
    stream.end()

    const attachment = new AttachmentBuilder(stream.path, { name: `ticket.log` })

    interaction.reply({
      content: t('ticketClosed', { lng: interaction.guild?.preferredLocale, member: interaction.user.toString() }),
      files: [attachment],
    })

    unlink(filePath, (err) => console.error(err))
  },
}

export default CloseTicket
