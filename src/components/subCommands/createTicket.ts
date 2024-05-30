import { ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, Role, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import TicketButton from '../buttons/Ticket'
import ModulesTickets from '../../schemas/Modules.Tickets'

const command = new SlashCommandSubcommandBuilder()
  .setName('create')
  .setDescription('Create ticket in current channel')
  .setDescriptionLocalizations({ uk: 'Створити квиток в цьому каналі' })
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('Ticket category')
      .setDescriptionLocalizations({ uk: 'Категорія квитків' })
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildCategory)
  )
  .addStringOption((option) =>
    option.setName('name').setDescription('Ticket name').setDescriptionLocalizations({ uk: 'Назва квитка' }).setRequired(true).setMaxLength(256)
  )
  .addStringOption((option) =>
    option.setName('prefix').setDescription('Ticket prefix').setDescriptionLocalizations({ uk: 'Префікс квитка' }).setRequired(true).setMaxLength(10)
  )
  .addStringOption((option) =>
    option.setName('button_text').setDescription('Button text').setDescriptionLocalizations({ uk: 'Текст кнопки' }).setMaxLength(32)
  )
  .addStringOption((option) =>
    option.setName('description').setDescription('Ticket description').setDescriptionLocalizations({ uk: 'Опис квитка' }).setMaxLength(1024)
  )

// Add 10 role select options
for (let i = 0; i < 10; i++) {
  command.addRoleOption((option) =>
    option
      .setName(`role_${i + 1}`)
      .setDescription('Role that will be able to access created tickets')
      .setDescriptionLocalizations({ uk: 'Роль, яка буде мати доступ до створених квитків' })
  )
}

const CreateTicketSubcommand: SubCommand = {
  data: command,
  execute: async (interaction) => {
    const lng = interaction.guild?.preferredLocale

    const button = new ButtonBuilder(TicketButton.button.data).setLabel(
      interaction.options.getString('button_text') || t('config:ticket.defaultButtonText', { lng })
    )
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.options.getString('name') as string,
      })
      .setDescription(interaction.options.getString('description') || t('config:ticket.defaultDesc', { lng }))
      .setColor('Green')

    const msg = await interaction.channel?.send({ embeds: [embed], components: [row] }).catch((err: Error) => {
      console.error(err)
    })
    if (!msg) return interaction.reply({ content: t('error', { lng }), ephemeral: true })

    await ModulesTickets.findOneAndUpdate(
      { guildId: interaction.guildId },
      {
        messageId: msg.id,
        prefix: interaction.options.getString('prefix') || 'ticket',
        categoryId: interaction.options.getChannel('channel')?.id,
        allowedRoles: interaction.options.resolved.roles.map((role: Role) => role.id),
      },
      { upsert: true }
    )

    interaction.reply({ content: t('config:ticket.initCreated', { lng: interaction.locale }), ephemeral: true })
  },
}

export default CreateTicketSubcommand
