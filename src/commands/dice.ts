import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import createRandomString from '../functions/createRandomString'
import { SlashCommand } from '../@types/discord'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Create a table for dice')
    .setDescriptionLocalizations({ uk: 'Створити стіл для гральних кубиків' }),
  cooldown: 10,
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setAuthor({ name: t('dice:embed_author', { lng: interaction.locale }) })
      .setFooter({ text: t('dice:embed_footer', { lng: interaction.locale }) })

    const random = createRandomString()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(random)
        .setStyle(ButtonStyle.Primary)
        .setLabel(t('dice:button_label', { lng: interaction.locale }))
    )

    const message = await interaction.reply({ embeds: [embed], components: [row] })

    const players: Players = {}
    let description = ''

    const collector = message.createMessageComponentCollector({
      time: 30000,
      componentType: ComponentType.Button,
    })

    collector.on('collect', (interaction: ButtonInteraction) => {
      if (!players[interaction.user.id]) {
        const dice1 = Math.floor(Math.random() * (8 - 1 + 1) + 1)
        const dice2 = Math.floor(Math.random() * (8 - 1 + 1) + 1)
        players[interaction.user.id] = dice1 + dice2

        description = description + `**${interaction.user.username}:** ${dice1}:${dice2}\n`

        const updatedEmbed = new EmbedBuilder()
          .setAuthor({ name: interaction.message.embeds[0].author?.name as string })
          .setFooter({ text: interaction.message.embeds[0].footer?.text as string })
          .setDescription(description)

        interaction.update({ embeds: [updatedEmbed] })
      } else {
        interaction.reply({ content: t('dice:already_played', { lng: interaction.locale }), ephemeral: true })
      }
    })

    collector.on('end', async () => {
      if (Object.keys(players).length === 0) {
        const newEmbed = new EmbedBuilder()
          .setAuthor({ name: embed.data.author?.name as string })
          .setDescription(t('dice:no_one_played'))
          .setColor('Red')
        await interaction.editReply({
          embeds: [newEmbed],
          components: [],
        })
      }

      let greatest = { id: '', value: 0 }

      for (const i in players) {
        if (players[i] > greatest.value) greatest = { id: i, value: players[i] }
      }

      const newEmbed = new EmbedBuilder()
        .setAuthor({
          name: t('dice:win_author', {
            lng: interaction.locale,
            member: interaction.guild?.members.cache.get(greatest.id)?.user.username,
            value: greatest.value,
          }),
        })
        .setColor('Green')

      await interaction.editReply({ embeds: [newEmbed], components: [] })
    })
  },
}

export default command

interface Players {
  [key: string]: number
}
