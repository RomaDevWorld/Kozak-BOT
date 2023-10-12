import { ChannelType, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'

const LogChannelSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('channel')
    .setDescription('Configure log channel')
    .setDescriptionLocalizations({ uk: 'Налаштувати канал для повідомлень журналу аудиту' })
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
    await Modules.updateOne({ guildId: interaction.guildId }, { 'log.channel': channel?.id }, { upsert: true })

    return interaction.reply({
      content: t('config:log.channel.set', { lng, channel: channel?.toString() }),
      ephemeral: true,
    })
  },
}

export default LogChannelSubcommand
