import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../@types/discord'
import Vote from '../schemas/Vote'
import VoteButton from '../components/buttons/Vote'
import CloseVote from '../components/buttons/CloseVote'
import { t } from 'i18next'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('poll')
    .addStringOption((option) =>
      option.setName('label').setDescription('Vote label').setDescriptionLocalizations({ uk: 'Текст опитування' }).setRequired(true).setMaxLength(256)
    )
    .addStringOption((option) =>
      option.setName('option1').setDescription('Option 1').setDescriptionLocalizations({ uk: 'Опція 1' }).setRequired(true).setMaxLength(800)
    )
    .addStringOption((option) =>
      option.setName('option2').setDescription('Option 2').setDescriptionLocalizations({ uk: 'Опція 2' }).setRequired(true).setMaxLength(800)
    )
    .addStringOption((option) => option.setName('option3').setDescription('3').setMaxLength(800))
    .addStringOption((option) => option.setName('option4').setDescription('4').setMaxLength(800))
    .addStringOption((option) => option.setName('option5').setDescription('5').setMaxLength(800))
    .setDescription('Create a vote in chat')
    .setDescriptionLocalizations({
      uk: 'Створити опитування в чаті',
    }),
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
    for (let i = 0; i < options.length; i++) {
      list.push(`**${i + 1}.** ${options[i].name} (0%)`)

      const dynamicButton = new ButtonBuilder(VoteButton.button.data)

      dynamicButton.setCustomId(`vote_${i + 1}`).setLabel(`${i + 1}`)

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
