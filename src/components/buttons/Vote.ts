import { ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { Button } from '../../@types/discord'
import Vote from '../../schemas/Vote'

const button: Button = {
  button: new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('vote_'),
  execute: async (interaction) => {
    const embedData = interaction.message.embeds[0]
    if (!embedData) return interaction.message.deletable ? interaction.message.delete() : null

    const voteId = embedData.footer?.text

    const data = await Vote.findById(voteId)

    if (!data) {
      console.error('[Error] Vote not found.')
      return await interaction.update({ components: [] })
    }

    data.options.forEach((option) => {
      option.value = option.value.filter((value) => value !== interaction.user.id)
    })

    const selectedId = parseInt(interaction.customId.split('_')[1]) - 1

    const selected = data.options[selectedId]

    selected.value.push(interaction.user.id as never)

    data.save()

    const totalResponses = data.options.reduce((sum, option) => sum + option.value.length, 0)

    const description = data.options.map(
      (option, index) => `**${index + 1}.** ${option.name} (${((option.value.length / totalResponses) * 100).toFixed(0)}%)`
    )

    const updatedEmbed = new EmbedBuilder()
      .setAuthor({ name: embedData.author?.name as string })
      .setFooter({ text: embedData.footer?.text as string })
      .setColor(embedData.color)
      .setDescription(description.join('\n'))

    interaction.update({ embeds: [updatedEmbed] })
  },
}
export default button
