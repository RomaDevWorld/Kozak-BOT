import { SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('ping').setDescription("Shows the bot's ping").setDescriptionLocalizations({
    uk: 'Показати затримку бота',
    fr:"Tester la latence du bot"
  }),
  cooldown: 10,
  execute: async (interaction) => {
    await interaction.reply({
      content: t('ping', { lng: interaction.locale }),
      ephemeral: true,
    })
  },
}

export default command
