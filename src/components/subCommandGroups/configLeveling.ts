import { SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import LevelingXpAmountSubcommand from '../subCommands/levelingXpAmount'
import LevelingXpCooldownSubcommand from '../subCommands/levelingXpCooldown'
import LevelingToggleSubcommand from '../subCommands/levelingToggle'
import LevelingNotificationsToggleSubcommand from '../subCommands/levelingNotifications'

const LevelingSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('leveling')
    .setDescription('Configure leveling (xp)')
    .addSubcommand(LevelingXpAmountSubcommand.data)
    .addSubcommand(LevelingXpCooldownSubcommand.data)
    .addSubcommand(LevelingToggleSubcommand.data)
    .addSubcommand(LevelingNotificationsToggleSubcommand.data)
    .setDescriptionLocalizations({ uk: 'Налаштувати досвід' }),
  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'xp-amount':
        return LevelingXpAmountSubcommand.execute(interaction)
      case 'xp-cooldown':
        return LevelingXpCooldownSubcommand.execute(interaction)
      case 'toggle':
        return LevelingToggleSubcommand.execute(interaction)
      case 'notify':
        return LevelingNotificationsToggleSubcommand.execute(interaction)
    }
  },
}

export default LevelingSubcommandGroup
