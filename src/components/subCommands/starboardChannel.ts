import { ChannelType, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'

const StarboardChannelSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('channel')
    .setDescription('Configure starboard channel')
    .setDescriptionLocalizations({ uk: 'Налаштувати канал для повідомлень старборд' })
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Select text channel')
        .setDescriptionLocalizations({ uk: 'Оберіть текстовий канал' })
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),
  execute: async (interaction) => {
    const lng = interaction.locale

    const channel = interaction.options.getChannel('channel')
    await Modules.updateOne({ guildId: interaction.guildId }, { 'starboard.channelId': channel?.id }, { upsert: true })

    return interaction.reply({
      content: t('config:starboard.channel.success', { lng, channel: channel?.toString() }),
      ephemeral: true,
    })
  },
}

export default StarboardChannelSubcommand
