import { ApplicationCommandType, ContextMenuCommandBuilder, Guild, MessageContextMenuCommandInteraction } from 'discord.js'
import { t } from 'i18next'
import { ContextMenuCommand } from '../../@types/discord'
import GuildMemberReport from '../logs/GuildMemberReport'

export const Reports = new Map<string, { members: string[] }>()

const command: ContextMenuCommand = {
  command: new ContextMenuCommandBuilder()
    .setName('Report this message')
    .setNameLocalizations({
      uk: 'Поскаржитись на повідомлення',
    })
    .setType(ApplicationCommandType.Message),
    install: {
      integration_types: [0],
      contexts: [0]
    },
  execute: async (interaction: MessageContextMenuCommandInteraction) => {
    const lng = interaction.locale

    const message = interaction.targetMessage
    if (message.author.bot) return interaction.reply({ content: t('memberBot', { lng }), ephemeral: true })
    if (message.author.id === interaction.user.id) return interaction.reply({ content: t('memberSelf', { lng }), ephemeral: true })

    if (Reports.get(message.author.id)?.members?.includes(interaction.user.id))
      return interaction.reply({ content: t('report.already', { lng }), ephemeral: true })

    if (!Reports.has(message.author.id)) {
      Reports.set(message.author.id, { members: [interaction.user.id] })
      setTimeout(() => Reports.delete(message.author.id), 60000)
      return interaction.reply({ content: t('report.success', { lng }), ephemeral: true })
    }

    Reports.get(message.author.id)?.members?.push(interaction.user.id)

    GuildMemberReport(interaction.guild as Guild, message)

    interaction.reply({ content: t('report.success', { lng }), ephemeral: true })
  },
}

export default command
