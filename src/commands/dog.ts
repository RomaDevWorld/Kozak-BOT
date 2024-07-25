import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import axios from 'axios'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('dog').setDescription('Show random dog').setDescriptionLocalizations({
    uk: 'Показати випадкову собаку',
    fr: "Faire apparaitre un chien aléatoire"
  }),
  cooldown: 10,
  install: {
    integration_types: [0, 1],
    contexts: [0, 1, 2]
  },
  execute: async (interaction) => {
    await interaction.deferReply().catch((err: Error) => console.error(err))

    const response = await axios.get('https://dog.ceo/api/breeds/image/random')
    if (!response) {
      console.error(`Couldn't fetch image`)
      console.error(response)
      return await interaction.editReply(t('animal_error', { lng: interaction.locale }))
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: t('dog_success', { lng: interaction.locale }) })
      .setColor('Grey')
      .setImage(response.data.message)
      .setFooter({
        text: t('animal_warning', { lng: interaction.locale, url: 'dog.ceo' }),
      })
    await interaction.editReply({ embeds: [embed] }).catch((err: Error) => console.error(err))
  },
}

export default command
