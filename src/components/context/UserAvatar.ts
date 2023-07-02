import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js'
import { ContextMenuCommand } from '../../../types'

const command: ContextMenuCommand = {
  command: new ContextMenuCommandBuilder().setName('Аватар учасника').setType(ApplicationCommandType.User),
  execute: async (interaction) => {
    try {
      const target = await interaction.targetUser
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Аватар ${target.username}`,
        })
        .setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setColor('Green')
      await interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (error) {
      return await interaction.reply({ content: 'This user has no avatar', ephemeral: true })
    }
  },
}

export default command
