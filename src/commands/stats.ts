import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'

const command: SlashCommand = {
  command: new SlashCommandBuilder().setName('stats').setDescription("Shows bot's statistics").setDescriptionLocalizations({
    uk: 'Показати статистику бота',
  }),
  cooldown: 10,
  execute: async (interaction) => {
    const lng = interaction.locale

    const embed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
      .setColor('Gold')
      .addFields([
        { name: t('guild_other', { lng }), value: interaction.client.guilds.cache.size.toString(), inline: true },
        { name: t('user_other', { lng }), value: interaction.client.users.cache.size.toString(), inline: true },
        { name: t('channel_other', { lng }), value: interaction.client.channels.cache.size.toString(), inline: true },
      ])
      .setTimestamp()

    interaction.reply({ embeds: [embed], ephemeral: true })
  },
}

export default command
