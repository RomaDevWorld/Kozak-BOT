import { ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { Button } from '../../@types/discord'
import Vote from '../../schemas/Vote'
import { t } from 'i18next'

const button: Button = {
  button: new ButtonBuilder().setCustomId('close-vote').setStyle(ButtonStyle.Danger),
  execute: async (interaction) => {
    const embedData = interaction.message.embeds[0]
    if (!embedData) return interaction.message.deletable ? interaction.message.delete() : null

    const voteId = embedData.footer?.text

    let data
    voteId ? (data = await Vote.findById(voteId)) : (data = await Vote.findOne({ 'message.id': interaction.message.id }))

    if (!data) {
      console.error('[Error] Vote not found.')
      return await interaction.update({ components: [] })
    }

    if (data.authorId !== interaction.user.id)
      return await interaction.reply({ content: t('vote_notauthor', { lng: interaction.locale }), ephemeral: true })

    await Vote.findByIdAndDelete(voteId)

    const updatedEmbed = new EmbedBuilder()
      .setDescription(embedData.description)
      .setAuthor({ name: embedData.author?.name as string })
      .setColor(embedData.color)

    return await interaction.update({ components: [], embeds: [updatedEmbed] })
  },
}

export default button
