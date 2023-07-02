import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types'
import axios from 'axios'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('dog').setDescription('Show random dog'),
  cooldown: 10,
  execute: async (interaction) => {
    await interaction.deferReply()

    const response = await axios.get('https://dog.ceo/api/breeds/image/random')
    if (!response) {
      console.error(`Couldn't fetch image`)
      console.error(response)
      return await interaction.editReply('Не вдалося отримати зображення від API')
    }

    const embed = new EmbedBuilder().setAuthor({ name: 'Випадкова собачка!' }).setColor('Grey').setImage(response.data.message).setFooter({
      text: 'Зображення взято з сайту "dog.ceo". Ми не відповідаємо за зміст.',
    })
    await interaction.editReply({ embeds: [embed] })
  },
}

export default command
