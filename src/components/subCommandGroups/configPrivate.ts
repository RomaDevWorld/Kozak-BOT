import { ChannelType, SlashCommandSubcommandGroupBuilder, TextChannel } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'

const PrivateSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('private')
    .setDescription('Config private channels')
    .setDescriptionLocalizations({ uk: 'Налаштувати особисті канали' })
    .addSubcommand((sub) =>
      sub
        .setName('set')
        .setDescription('Set lobby channel')
        .setDescriptionLocalizations({ uk: 'Встановити канал лобі' })
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Select voice channel')
            .setDescriptionLocalizations({ uk: 'Оберіть голосовий канал' })
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
    )
    .addSubcommand((sub) => sub.setName('off').setDescription('Turn off this module').setDescriptionLocalizations({ uk: 'Вимкнути цей модуль' })),
  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'set': {
        const channel = interaction.options.getChannel('channel') as TextChannel
        await Modules.updateOne({ guildId: interaction.guildId }, { 'lobby.channel': channel.id }, { upsert: true })
        interaction.reply({ content: t('config:lobby.channelSet', { lng: interaction.locale, channel: channel.toString() }), ephemeral: true })
        break
      }
      case 'off': {
        await Modules.updateOne({ guildId: interaction.guildId }, { 'lobby.channel': null }, { upsert: true })
        interaction.reply({ content: t('config:lobby.channelOff', { lng: interaction.locale }), ephemeral: true })
        break
      }
    }
  },
}

export default PrivateSubcommandGroup
