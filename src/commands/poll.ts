import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../@types/discord'
import Vote from '../schemas/Vote'
import VoteButton from '../components/buttons/Vote'
import CloseVote from '../components/buttons/CloseVote'
import { t } from 'i18next'

const cmd = new SlashCommandBuilder().setName('poll').setDescription('Create a vote in chat').setDescriptionLocalizations({
  uk: 'Створити опитування в чаті',
  fr: 'Créer un sondage dans le chat',
})
cmd.addStringOption((option) =>
  option
    .setName('label')
    .setDescription('Vote label')
    .setDescriptionLocalizations({
      uk: 'Текст опитування',
      fr: 'Titre du sondage',
    })
    .setRequired(true)
    .setMaxLength(256)
)
for (const i of [1, 2, 3, 4, 5]) {
  cmd.addStringOption((option) =>
    option
      .setName('option' + i)
      .setDescription('Option ' + i)
      .setDescriptionLocalizations({
        uk: 'Опція ' + i,
        fr: 'Choix N°' + i,
      })
      .setRequired([1, 2].includes(i))
      .setMaxLength(800)
  )
}
const command: SlashCommand = {
  command: cmd,
  cooldown: 10,
  execute: async (interaction) => {
    const value = await Vote.create({
      authorId: interaction.user.id,
      options: [],
    })

    const options = []
    for (let i = 0; i <= 5; i++) {
      const option = interaction.options.getString(`option${i}`)
      if (option) options.push({ name: option, value: [] })
    }
    await Vote.findByIdAndUpdate(value.id, { options })

    const optionsRow = new ActionRowBuilder<ButtonBuilder>()

    const list = []
    for (const i in options) {
      const index = parseInt(i)

      list.push(`**${index + 1}.** ${options[i].name} (0%)`)

      const dynamicButton = new ButtonBuilder(VoteButton.button.data)

      dynamicButton.setCustomId(`vote_${index + 1}`).setLabel(`${index + 1}`)

      optionsRow.addComponents(dynamicButton)
    }

    const closeButton = new ButtonBuilder(CloseVote.button.data).setLabel('Close').setLabel(t('vote_closebutton', { lng: interaction.locale }))

    const closeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton)

    const embed = new EmbedBuilder()
      .setAuthor({ name: interaction.options.getString('label') as string })
      .setColor('Random')
      .setDescription(list.join(`\n`))
      .setFooter({ text: value.id })

    interaction.reply({
      embeds: [embed],
      components: [optionsRow, closeRow],
    })

    //END
  },
}

export default command
