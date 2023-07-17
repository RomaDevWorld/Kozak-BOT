import { GuildMemberRoleManager, Role, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'

const RolesAutoRoleSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('autorole')
    .setDescription('Set up automatic role assignment when a member joins the server')
    .setDescriptionLocalizations({ uk: 'Налаштувати автоматичну видачу ролі, коли учасник приєднується до серверу' })
    .addRoleOption((option) =>
      option.setName('role').setDescription('Role to assign').setDescriptionLocalizations({ uk: 'Роль для видачі' }).setRequired(true)
    ),
  execute: async function (interaction) {
    const lng = interaction.locale

    const role = interaction.options.getRole('role') as Role

    if (role.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position)
      return interaction.reply({ content: t('config:autoRolePosition', { lng }), ephemeral: true })

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'roles.autorole': role.id })

    interaction.reply({ content: t('config:autoRoleSet', { lng, role: role.toString() }), ephemeral: true })
  },
}

export default RolesAutoRoleSubcommand
