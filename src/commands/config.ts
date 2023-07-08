import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../@types/discord'
import ConfigLogSubcommandGroup from '../components/subCommandGroups/configLog'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure bot behavior')
    .addSubcommandGroup(ConfigLogSubcommandGroup.data)
    .setDescriptionLocalizations({
      uk: 'Налаштувати бота',
    }),
  cooldown: 10,
  execute: async (interaction) => {
    switch (interaction.options.getSubcommandGroup()) {
      case 'log': {
        return ConfigLogSubcommandGroup.execute(interaction)
      }
    }
  },
}

export default command
