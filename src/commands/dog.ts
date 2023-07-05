import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types'
import axios from 'axios'
import { t } from 'i18next'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('dog').setDescription('Show random dog').setDescriptionLocalizations({
    uk: 'Показати випадкову собаку',
  }),
  cooldown: 10,
  execute: async (interaction) => {
    await interaction.deferReply()

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
    await interaction.editReply({ embeds: [embed] })
  },
}

export default command
