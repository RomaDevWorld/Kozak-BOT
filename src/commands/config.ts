import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../@types/discord'
import ConfigLogSubcommandGroup from '../components/subCommandGroups/configLog'
import PrivateSubcommandGroup from '../components/subCommandGroups/configPrivate'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure bot behavior')
    .addSubcommandGroup(ConfigLogSubcommandGroup.data)
    .addSubcommandGroup(PrivateSubcommandGroup.data)
    .setDescriptionLocalizations({
      uk: 'Налаштувати бота',
    }),
  cooldown: 10,
  execute: async (interaction) => {
    switch (interaction.options.getSubcommandGroup()) {
      case 'log': {
        return ConfigLogSubcommandGroup.execute(interaction)
      }
      case 'private': {
        return PrivateSubcommandGroup.execute(interaction)
      }
    }
  },
}

export default command
