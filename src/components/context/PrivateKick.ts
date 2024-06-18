import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, GuildMember, ImageURLOptions, UserContextMenuCommandInteraction } from 'discord.js'
import { t } from 'i18next'
import { ContextMenuCommand } from '../../@types/discord'
import { getPrivateChannel } from '../../functions/usePrivateChannel'

const command: ContextMenuCommand = {
  command: new ContextMenuCommandBuilder()
    .setName("Kick from private channel")
    .setNameLocalizations({
      uk: 'Вигнати з приватного каналу',
    })
    .setType(ApplicationCommandType.User),
  execute: async (interaction: UserContextMenuCommandInteraction) => {
    const lng = interaction.locale
    const target = interaction.targetMember
    if (!target) return interaction.reply({ content: t('memberNotFound', { lng }), ephemeral: true })
    if (target.user.id === interaction.user.id) return interaction.reply({ content: t('memberSelf', { lng }), ephemeral: true })

    const channel = await getPrivateChannel(interaction.member as GuildMember)
    if (!channel) return interaction.reply({ content: t('privates.noChannel', { lng }), ephemeral: true })

    channel?.permissionOverwrites.edit(target.user.id, {
      ViewChannel: false,
    })

    interaction.reply({ content: t('privates.kickSuccess', { lng, member: target.toString() }), ephemeral: true })
  },
}

export default command
