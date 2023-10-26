import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import timers from 'node:timers/promises'
import { SlashCommand } from '../@types/discord'

const ClearCommand: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('8ball')
    .addStringOption((option) =>
      option.setName('question').setDescription('Your question').setRequired(true).setDescriptionLocalizations({
        uk: 'Ваше запитання',
        fr: 'Votre question',
      })
    )
    .setDescription('Ask a question to the Magic 8 Ball')
    .setDescriptionLocalizations({
      uk: 'Поставте запитання і ми начаклуємо відповідь',
      fr: 'Poser une question à la 8 boule magique',
    }),
  execute: async (interaction) => {
    await interaction.deferReply().catch((err: Error) => console.error(err))

    await timers.setTimeout(5000)

    const question = interaction.options.get('question')?.value

    const embed = new EmbedBuilder()
      .setAuthor({
        name: t('8ball.embed_author', { lng: interaction.locale }),
        iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/8-Ball_Pool.svg/1024px-8-Ball_Pool.svg.png',
      })
      .setDescription(
        `**${t('8ball.embed_description', { lng: interaction.locale })}** "${question}"\n\n` +
          `${t(`8ball.${Math.floor(Math.random() * 8) as 0}`, { lng: interaction.locale })}`
      )
      .setColor('DarkButNotBlack')
      .setFooter({ text: t('8ball.embed_footer', { lng: interaction.locale }) })

    await interaction.editReply({ embeds: [embed] }).catch((err: Error) => console.error(err))
  },
  cooldown: 10,
}

export default ClearCommand
