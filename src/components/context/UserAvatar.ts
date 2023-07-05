import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js'
import { ContextMenuCommand } from '../../../types'
import { t } from 'i18next'

const command: ContextMenuCommand = {
  command: new ContextMenuCommandBuilder()
    .setName("Get user's avatar")
    .setNameLocalizations({
      uk: 'Отримати аватар учасника',
    })
    .setType(ApplicationCommandType.User),
  execute: async (interaction) => {
    try {
      const target = await interaction.targetUser
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${target.username}`,
        })
        .setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setColor('Green')
      await interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (error) {
      return await interaction.reply({ content: t('avatar_noavatar', { lng: interaction.locale }), ephemeral: true })
    }
  },
}

export default command
