import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import axios from 'axios'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('cat').setDescription('Show random cat').setDescriptionLocalizations({
    uk: 'Показати випадкового кота!',
    fr: 'Faire apparaitre un chat aléatoire',
  }),
  install: {
    integration_types: [0, 1],
    contexts: [0, 1, 2]
  },
  cooldown: 10,
  execute: async (interaction) => {
    await interaction.deferReply().catch((err: Error) => console.error(err))

    const response = await axios.get('https://api.thecatapi.com/v1/images/search')
    if (!response) {
      console.error(`Couldn't fetch image`)
      console.error(response)
      return await interaction.editReply(t('animal_error', { lng: interaction.locale }))
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: t('cat_success', { lng: interaction.locale }) })
      .setColor('Orange')
      .setImage(response.data[0].url)
      .setFooter({
        text: t('animal_warning', { lng: interaction.locale, url: 'thecatapi.com' }),
      })
    await interaction.editReply({ embeds: [embed] }).catch((err: Error) => console.error(err))
  },
}

export default command
