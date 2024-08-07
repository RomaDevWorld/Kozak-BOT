import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../@types/discord'
import ConfigLogSubcommandGroup from '../components/subCommandGroups/configLog'
import PrivateSubcommandGroup from '../components/subCommandGroups/configPrivate'
import CounterSubcommandGroup from '../components/subCommandGroups/configCounters'
import RolesSubCommandGroup from '../components/subCommandGroups/configRoles'
import TicketsSubCommandGroup from '../components/subCommandGroups/configTickets'
import LevelingSubcommandGroup from '../components/subCommandGroups/configLeveling'
import StarboardSubCommandGroup from '../components/subCommandGroups/configStarboard'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure bot behavior')
    .addSubcommandGroup(ConfigLogSubcommandGroup.data)
    .addSubcommandGroup(PrivateSubcommandGroup.data)
    .addSubcommandGroup(CounterSubcommandGroup.data)
    .addSubcommandGroup(RolesSubCommandGroup.data)
    .addSubcommandGroup(TicketsSubCommandGroup.data)
    .addSubcommandGroup(LevelingSubcommandGroup.data)
    .addSubcommandGroup(StarboardSubCommandGroup.data)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescriptionLocalizations({
      uk: 'Налаштувати бота',
    }),
    install: {
      integration_types: [0],
      contexts: [0]
    },
  cooldown: 10,
  execute: async (interaction) => {
    switch (interaction.options.getSubcommandGroup()) {
      case 'log': {
        return ConfigLogSubcommandGroup.execute(interaction)
      }
      case 'private': {
        return PrivateSubcommandGroup.execute(interaction)
      }
      case 'counter': {
        return CounterSubcommandGroup.execute(interaction)
      }
      case 'roles': {
        return RolesSubCommandGroup.execute(interaction)
      }
      case 'tickets': {
        return TicketsSubCommandGroup.execute(interaction)
      }
      case 'leveling': {
        return LevelingSubcommandGroup.execute(interaction)
      }
      case 'starboard': {
        return StarboardSubCommandGroup.execute(interaction)
      }
    }
  },
}

export default command
