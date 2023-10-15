import { SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import StarboardChannelSubcommand from '../subCommands/starboardChannel'
import StarboardEmojiSubcommand from '../subCommands/starboardEmoji'
import StarboardToggleSubcommand from '../subCommands/starboardToggle'
import StarboardThresholdSubcommand from '../subCommands/starboardThreshold'

const StarboardSubCommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('starboard')
    .setDescription('Configure starboard')
    .setDescriptionLocalizations({ uk: 'Налаштувати старборд' })
    .addSubcommand(StarboardChannelSubcommand.data)
    .addSubcommand(StarboardEmojiSubcommand.data)
    .addSubcommand(StarboardToggleSubcommand.data)
    .addSubcommand(StarboardThresholdSubcommand.data),
  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'channel': {
        return StarboardChannelSubcommand.execute(interaction)
      }
      case 'emoji': {
        return StarboardEmojiSubcommand.execute(interaction)
      }
      case 'toggle': {
        return StarboardToggleSubcommand.execute(interaction)
      }
      case 'threshold': {
        return StarboardThresholdSubcommand.execute(interaction)
      }
    }
  },
}

export default StarboardSubCommandGroup
