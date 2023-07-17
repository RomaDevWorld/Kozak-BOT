import { SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import RolesAutoRoleSubcommand from '../subCommands/rolesAutorole'
import RolesRestoreSubcommand from '../subCommands/rolesRestore'
import RolesAutoRoleSubcommandOff from '../subCommands/rolesAutoRoleOff'

const RolesSubCommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('roles')
    .setDescription('Configure roles')
    .addSubcommand(RolesAutoRoleSubcommand.data)
    .addSubcommand(RolesRestoreSubcommand.data)
    .addSubcommand(RolesAutoRoleSubcommandOff.data)
    .setDescriptionLocalizations({ uk: 'Налаштувати ролі' }),
  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'autorole':
        return RolesAutoRoleSubcommand.execute(interaction)
      case 'autorole-off':
        return RolesAutoRoleSubcommandOff.execute(interaction)
      case 'restore':
        return RolesRestoreSubcommand.execute(interaction)
    }
  },
}

export default RolesSubCommandGroup
