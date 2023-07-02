import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types'
import axios from 'axios'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('cat').setDescription('Show random cat'),
  cooldown: 10,
  execute: async (interaction) => {
    await interaction.deferReply()

    const response = await axios.get('https://api.thecatapi.com/v1/images/search')
    if (!response) {
      console.error(`Couldn't fetch image`)
      console.error(response)
      return await interaction.editReply('Не вдалося отримати зображення від API')
    }

    const embed = new EmbedBuilder().setAuthor({ name: 'Випадкова киця!' }).setColor('Orange').setImage(response.data[0].url).setFooter({
      text: 'Зображення взято з сайту "thecatapi.com". Ми не відповідаємо за зміст.',
    })
    await interaction.editReply({ embeds: [embed] })
  },
}

export default command
