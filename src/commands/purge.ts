import { ChannelType, Collection, EmbedBuilder, Message, PartialMessage, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete large amount of messages')
    .setDescriptionLocalizations({
      uk: 'Видалення великої кількості повідомлень',
      fr: 'Supprime un groupe large de messages du salon',
    })
    .addIntegerOption((option) =>
      option
        .setMinValue(0)
        .setMaxValue(100)
        .setName('amount')
        .setRequired(true)
        .setDescription('Max amount of messages')
        .setDescriptionLocalizations({
          uk: 'Максимальна кількість повідомлень',
          fr: 'Nombre maximum de messages',
        })
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('Delete messages from a specific user').setDescriptionLocalizations({
        uk: 'Видалення повідомлень від вказаного користувача',
        fr: "Supprimer les messages d'un utilisateur spécifique",
      })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  cooldown: 30,
  install: {
    integration_types: [0],
    contexts: [0]
  },
  execute: async (interaction) => {
    const amount = interaction.options.getInteger('amount') as number
    const user = interaction.options.getUser('user')

    if (interaction.channel?.type !== ChannelType.GuildText) return console.error('[Error] Purge has been executed in wrong channel')

    let messages: Collection<string, Message> = await interaction.channel?.messages.fetch({
      limit: amount,
    })
    if (user) messages = messages?.filter((m) => m.author.id === user.id)

    const agedMessages = messages?.filter((m) => m.createdTimestamp < Date.now() - 1000 * 60 * 60 * 24 * 14)

    await interaction.channel?.bulkDelete(messages, true).then(async (messages: Collection<string, PartialMessage>) => {
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(t('purge.success_title', { lng: interaction.locale }))
        .setDescription(t('purge.success_description', { lng: interaction.locale, messages: messages.size, agedMessages: agedMessages.size }))
      await interaction.reply({ embeds: [embed], ephemeral: true })

      let n = 1
      agedMessages.forEach(async (message: Message) => {
        setTimeout(async () => {
          await message.delete()
          n++
        }, n * 1000)
      })
    })
  },
}

export default command
