import { ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder } from 'discord.js'
import { Button } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'

const TicketButton: Button = {
  button: new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('ticket'),
  execute: async (interaction) => {
    const id = interaction.message.id
    const lng = interaction.locale

    const data = await Modules.findOne({ guildId: interaction.guildId })
    const thisTicket = data?.tickets.find((ticket) => ticket.messageId === id)
    const category = interaction.guild?.channels.cache.get(thisTicket?.channelId as string)
    const allowedRoles = thisTicket?.allowedRoles

    if (!category) return interaction.reply({ content: t('error', { lng }), ephemeral: true })

    const existingTicketChannel = interaction.guild?.channels.cache.find((channel) => channel.name === `ticket-${interaction.user.id}`)
    if (existingTicketChannel) return interaction.reply({ content: t('error', { lng }), ephemeral: true })

    const ticketChannel = await interaction.guild?.channels.create({
      name: `ticket-${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: category.id,
      topic: t('ticketChannelTopic', { lng: interaction.guild.preferredLocale, member: interaction.user.username, memberId: interaction.user.id }),
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: ['SendMessages', 'ViewChannel'],
        },
        {
          id: interaction.guild?.roles.everyone,
          deny: ['ViewChannel'],
        },
      ],
    })

    allowedRoles?.forEach((role) => ticketChannel?.permissionOverwrites.edit(role, { ViewChannel: true, SendMessages: true }))

    const embed = new EmbedBuilder()
      .setAuthor({ name: t('ticketCreated', { lng: interaction.guild?.preferredLocale }) })
      .setDescription(t('ticketDescription', { lng: interaction.guild?.preferredLocale }))
      .setColor('Green')

    const ticketMessage = await ticketChannel?.send({ content: '@here', embeds: [embed] }).catch((err) => console.error(err))
    ticketMessage?.pin()

    interaction.reply({ content: ticketChannel?.toString(), ephemeral: true })
  },
}
export default TicketButton
