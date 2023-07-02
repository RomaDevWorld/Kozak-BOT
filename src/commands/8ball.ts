import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types'

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('8ball')
    .addStringOption((option) => option.setName('question').setDescription('Питання шару').setRequired(true))
    .setDescription('Поставте запитання і ми начаклуємо відповідь'),
  execute: async (interaction) => {
    await interaction.deferReply()

    const question = interaction.options.get('question')?.value

    const answers = [
      'Упс! Ми впустили магічний шар!',
      'Чітке "Ні."',
      'Чітке "Так."',
      'В магічного шара є сумніви..',
      'Духи кажуть "Так.."\nАле чи можна їм довіряти?',
      'Духи кажуть "Так.."\nАле чи можна їм довіряти?',
      '404: Не знайдено',
      'Духи засмучені цим запитанням',
      'Духам подобається Ваше запитання',
    ]

    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Магічний шар каже..',
        iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/8-Ball_Pool.svg/1024px-8-Ball_Pool.svg.png',
      })
      .setDescription(`**Запитання:** "${question}"\n\n` + `${answers[Math.floor(Math.random() * answers.length)]}`)
      .setColor('DarkButNotBlack')
      .setFooter({ text: "Вживання магії шкодить Вашому здоров'ю" })

    await interaction.editReply({ embeds: [embed] })
  },
  cooldown: 10,
}

export default ClearCommand
