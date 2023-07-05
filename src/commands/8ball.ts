import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../types'
import { t } from 'i18next'
import timers from 'node:timers/promises'

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('8ball')
    .addStringOption((option) =>
      option.setName('question').setDescription('Your question').setDescriptionLocalizations({ uk: 'Ваше запитання' }).setRequired(true)
    )
    .setDescription('Ask a question to the Magic 8 Ball')
    .setDescriptionLocalizations({
      uk: 'Поставте запитання і ми начаклуємо відповідь',
    }),
  execute: async (interaction) => {
    await interaction.deferReply().catch((err) => console.error(err))

    await timers.setTimeout(5000)

    const question = interaction.options.get('question')?.value

    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Магічний шар каже..',
        iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/8-Ball_Pool.svg/1024px-8-Ball_Pool.svg.png',
      })
      .setDescription(`**Запитання:** "${question}"\n\n` + `${t(`8ball:${Math.floor(Math.random() * 8)}`, { lng: interaction.locale })}`)
      .setColor('DarkButNotBlack')
      .setFooter({ text: "Вживання магії шкодить Вашому здоров'ю" })

    await interaction.editReply({ embeds: [embed] }).catch((err) => console.error(err))
  },
  cooldown: 10,
}

export default ClearCommand
