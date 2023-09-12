import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../@types/discord'
import XPs from '../schemas/XPs'
import { t } from 'i18next'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('level-top')
    .setDescription('Show top 10 members with the highest XP level')
    .setDescriptionLocalizations({
      uk: 'Показати 10 людей з найбільшим рівнем досвіду',
    }),
  cooldown: 10,
  execute: async (interaction) => {
    const lng = interaction.locale

    const data = await XPs.find({ guildId: interaction.guildId }).sort({ xp: -1 }).limit(10)
    if (!data) return interaction.reply({ content: t('xp.top.no_data', { lng }), ephemeral: true })

    const embed = new EmbedBuilder()
      .setAuthor({ name: t('xp.top.author', { lng }), iconURL: interaction.guild?.iconURL() as string })
      .setDescription(data?.map((d, i) => `${i + 1}. <@${d.memberId}> - ${d.xp}`).join('\n') || ' ')
      .setColor('Orange')

    interaction.reply({ embeds: [embed], ephemeral: true })
  },
}

export default command
