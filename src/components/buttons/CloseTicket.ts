import { ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import { Button } from '../../@types/discord'
import { t } from 'i18next'

const CloseTicket: Button = {
  button: new ButtonBuilder().setCustomId('close_ticket').setEmoji('🔒').setStyle(ButtonStyle.Danger),
  execute(interaction) {
    const channel = interaction.channel as TextChannel
    if (!channel) return

    channel.permissionOverwrites.cache.forEach((i) =>
      i.channel.permissionOverwrites.edit(i.id, {
        SendMessages: false,
      })
    )
    channel.setName(`archive-` + channel.name)

    interaction.message.edit({ components: [] })
    interaction.reply(t('ticket.closed', { lng: interaction.guild?.preferredLocale, member: interaction.user.toString() }))
  },
}

export default CloseTicket
