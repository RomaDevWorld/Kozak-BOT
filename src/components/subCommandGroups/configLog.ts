import { SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import LogChannelSubcommand from '../subCommands/logChannel'
import LogChannelRemoveSubcommand from '../subCommands/logChannelRemove'
import LogSwitchesSubcommand from '../subCommands/logSwitch'
import LogIgnoredChannelsSubcommand from '../subCommands/logIgnoredChannels'
import LogIgnoredRolesSubcommand from '../subCommands/logIgnoredRoles'

const ConfigLogSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('log')
    .setDescription('Configure logging module')
    .setDescriptionLocalizations({ uk: 'Налаштувати модуль журналу аудиту' })
    .addSubcommand(LogChannelSubcommand.data)
    .addSubcommand(LogChannelRemoveSubcommand.data)
    .addSubcommand(LogSwitchesSubcommand.data)
    .addSubcommand(LogIgnoredRolesSubcommand.data)
    .addSubcommand(LogIgnoredChannelsSubcommand.data),
  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'channel':
        return LogChannelSubcommand.execute(interaction)
      case 'channel-remove':
        return LogChannelRemoveSubcommand.execute(interaction)
      case 'switch':
        return LogSwitchesSubcommand.execute(interaction)
      case 'ignored-channels':
        return LogIgnoredChannelsSubcommand.execute(interaction)
      case 'ignored-roles':
        return LogIgnoredRolesSubcommand.execute(interaction)
    }
  },
}

export default ConfigLogSubcommandGroup
