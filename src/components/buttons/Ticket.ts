import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Collection, EmbedBuilder, TextChannel } from 'discord.js'
import { Button } from '../../@types/discord'
import { t } from 'i18next'
import CloseTicket from './CloseTicket'
import ModulesTickets from '../../schemas/Modules.Tickets'

const TicketButton: Button = {
  button: new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('ticket'),
  execute: async (interaction) => {
    const id = interaction.message.id
    const lng = interaction.locale

    const thisTicket = await ModulesTickets.findOne({ guildId: interaction.guildId, messageId: id })
    if (!thisTicket) return interaction.reply({ content: t('error', { lng }), ephemeral: true })

    const category = interaction.guild?.channels.cache.get(thisTicket?.categoryId as string)
    const allowedRoles = thisTicket?.allowedRoles
    const ticketPrefix = thisTicket?.prefix || 'ticket'

    if (!category) return interaction.reply({ content: t('error', { lng }), ephemeral: true })

    const channelsWithPrefix = interaction.guild?.channels.cache.filter(
      (channel) => channel.name.startsWith(ticketPrefix) && channel.type === ChannelType.GuildText
    ) as Collection<string, TextChannel> | undefined

    const existingTicketChannel = channelsWithPrefix?.find((channel) => channel.topic === interaction.user.toString())
    if (existingTicketChannel) return interaction.reply({ content: t('ticket.alreadyCreated', { lng }), ephemeral: true })

    const ticketChannel = await interaction.guild?.channels.create({
      name: `${ticketPrefix}-${(channelsWithPrefix?.size || 0) + 1}`,
      type: ChannelType.GuildText,
      parent: category.id,
      topic: interaction.user.toString(),
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'ReadMessageHistory', 'SendMessages'],
        },
        {
          id: interaction.guild?.roles.everyone,
          deny: ['ViewChannel'],
        },
      ],
    })

    allowedRoles?.forEach((role) =>
      ticketChannel?.permissionOverwrites.edit(role, { ViewChannel: true, ReadMessageHistory: true, SendMessages: true })
    )

    const CloseButton = new ButtonBuilder(CloseTicket.button.data)
      .setLabel(t('ticket.close', { lng: interaction.guild?.preferredLocale }))
      .setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(CloseButton)

    const embed = new EmbedBuilder()
      .setAuthor({ name: t('ticket.created', { lng: interaction.guild?.preferredLocale }) })
      .setDescription(t('ticket.description', { lng: interaction.guild?.preferredLocale }))
      .setColor('Green')

    const ticketMessage = await ticketChannel?.send({ content: '@here', embeds: [embed], components: [row] }).catch((err) => console.error(err))
    ticketMessage?.pin()

    interaction.reply({ content: `**${t('ticket.created', { lng })}** ${ticketChannel?.toString()}`, ephemeral: true })
  },
}
export default TicketButton
