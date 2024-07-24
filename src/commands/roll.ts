import { SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Pick a random number in the range')
    .setDescriptionLocalizations({
      uk: 'Вибрати випадкове число в діапазоні',
    })
    .addIntegerOption((option) =>
      option.setMinValue(0).setName('min').setDescription('Minimum possible number (0 by default)').setDescriptionLocalizations({
        uk: 'Мінімальне число в діапазоні (0 за замовчуванням)',
      })
    )
    .addIntegerOption((option) =>
      option.setMinValue(0).setName('max').setDescription('Max possible number (100 by default)').setDescriptionLocalizations({
        uk: 'Максимальне число в діапазоні (100 за замовчуванням)',
      })
    ),
  cooldown: 10,
  execute: async (interaction) => {
    let min: number = (await interaction.options.getInteger('min')) || 0
    let max: number = (await interaction.options.getInteger('max')) || 100

    if (min > max) {
      min = 0
      max = 100
    }

    const result = Math.floor(Math.random() * (max - min + 1)) + min
    await interaction.reply({ content: `${t('roll', { lng: interaction.locale })} (${min} - ${max}): \`${result}\`` })
  },
}

export default command
