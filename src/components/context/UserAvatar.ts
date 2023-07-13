import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, ImageURLOptions, UserContextMenuCommandInteraction } from 'discord.js'
import { t } from 'i18next'
import { ContextMenuCommand } from '../../@types/discord'

const command: ContextMenuCommand = {
  command: new ContextMenuCommandBuilder()
    .setName("Get user's avatar")
    .setNameLocalizations({
      uk: 'Отримати аватар учасника',
    })
    .setType(ApplicationCommandType.User),
  execute: async (interaction: UserContextMenuCommandInteraction) => {
    try {
      const target = interaction.targetUser
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${target.username}`,
        })
        .setImage(target.avatarURL({ dynamic: true, size: 2048 } as ImageURLOptions))
        .setColor('Green')
      await interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (error) {
      return await interaction.reply({ content: t('avatar_noavatar', { lng: interaction.locale }), ephemeral: true })
    }
  },
}

export default command
