import { SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import LogChannelSubcommand from '../subCommands/logChannel'
import LogChannelRemoveSubcommand from '../subCommands/logChannelRemove'
import LogSwitchesSubcommand from '../subCommands/logSwitch'

const ConfigLogSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('log')
    .setDescription('Configure logging module')
    .setDescriptionLocalizations({ uk: 'Налаштувати модуль журналу аудиту' })
    .addSubcommand(LogChannelSubcommand.data)
    .addSubcommand(LogChannelRemoveSubcommand.data)
    .addSubcommand(LogSwitchesSubcommand.data),
  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'channel':
        return LogChannelSubcommand.execute(interaction)
      case 'channel-remove':
        return LogChannelRemoveSubcommand.execute(interaction)
      case 'switch':
        return LogSwitchesSubcommand.execute(interaction)
    }
  },
}

export default ConfigLogSubcommandGroup
