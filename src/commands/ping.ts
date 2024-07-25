import { SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('ping').setDescription("Shows the bot's ping").setDescriptionLocalizations({
    uk: 'Показати затримку бота',
    fr: 'Tester la latence du bot',
  }),
  cooldown: 10,
  install: {
    integration_types: [0, 1],
    contexts: [0, 1, 2]
  },
  execute: async (interaction) => {
    const start = await interaction.deferReply({ ephemeral: true })

    await interaction.editReply({
      content: t('ping', { lng: interaction.locale }) + ` ${Math.round(Date.now() - start.createdTimestamp)} ms`,
    })
  },
}

export default command
