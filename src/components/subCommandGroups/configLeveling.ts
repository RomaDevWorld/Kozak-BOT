import { SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import LevelingXpAmountSubcommand from '../subCommands/levelingXpAmount'
import LevelingXpCooldownSubcommand from '../subCommands/levelingXpCooldown'
import LevelingToggleSubcommand from '../subCommands/levelingToggle'
import LevelingNotificationsToggleSubcommand from '../subCommands/levelingNotifications'
import LevelingIgnoredChannelsSubcommand from '../subCommands/levelingIgnoredChannels'
import LevelingIgnoredRolesSubcommand from '../subCommands/levelingIgnoredRoles'
import { LevelingRankingAddSubcommand, LevelingRankingListSubcommand, LevelingRankingRemoveSubcommand } from '../subCommands/levelingRanking'

const LevelingSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('leveling')
    .setDescription('Configure leveling (xp)')
    .addSubcommand(LevelingXpAmountSubcommand.data)
    .addSubcommand(LevelingXpCooldownSubcommand.data)
    .addSubcommand(LevelingToggleSubcommand.data)
    .addSubcommand(LevelingNotificationsToggleSubcommand.data)
    .addSubcommand(LevelingIgnoredChannelsSubcommand.data)
    .addSubcommand(LevelingIgnoredRolesSubcommand.data)
    .addSubcommand(LevelingRankingListSubcommand.data)
    .addSubcommand(LevelingRankingAddSubcommand.data)
    .addSubcommand(LevelingRankingRemoveSubcommand.data)
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
      case 'ignored-channels':
        return LevelingIgnoredChannelsSubcommand.execute(interaction)
      case 'ignored-roles':
        return LevelingIgnoredRolesSubcommand.execute(interaction)
      case 'ranking-list':
        return LevelingRankingListSubcommand.execute(interaction)
      case 'ranking-add':
        return LevelingRankingAddSubcommand.execute(interaction)
      case 'ranking-remove':
        return LevelingRankingRemoveSubcommand.execute(interaction)
    }
  },
}

export default LevelingSubcommandGroup
