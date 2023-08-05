import { SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import PrivateManageLimitSubcommand from '../subCommands/privateManageLimit'
import PrivateManagePublicSubcommand from '../subCommands/privateManagePublic'
import PrivateManageDeleteSubcommand from '../subCommands/privateManageDelete'
import PrivateManageRenameSubcommand from '../subCommands/privateManageRename'

const ManagePrivateSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('manage')
    .setDescription('Manage private channel')
    .setDescriptionLocalizations({ uk: 'Керувати особистим каналом' })
    .addSubcommand(PrivateManageLimitSubcommand.data)
    .addSubcommand(PrivateManagePublicSubcommand.data)
    .addSubcommand(PrivateManageDeleteSubcommand.data)
    .addSubcommand(PrivateManageRenameSubcommand.data),

  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'limit':
        return PrivateManageLimitSubcommand.execute(interaction)
      case 'public':
        return PrivateManagePublicSubcommand.execute(interaction)
      case 'delete':
        return PrivateManageDeleteSubcommand.execute(interaction)
      case 'rename':
        return PrivateManageRenameSubcommand.execute(interaction)
    }
  },
}

export default ManagePrivateSubcommandGroup
