import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types'
import i18n from '../lib/i18'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('ping').setDescription("Shows the bot's ping"),
  cooldown: 10,
  execute: async (interaction) => {
    await interaction.reply({
      content: i18n.t('ping', { lng: interaction.locale }),
      ephemeral: true,
    })
  },
}

export default command
