import { CategoryChannel, ChannelType, SlashCommandSubcommandGroupBuilder, VoiceChannel } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'

const CounterSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('counter')
    .setDescription('Configure logging module')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set counter channel')
        .setDescriptionLocalizations({ uk: 'Встановити канал лічильника' })
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Voice channel or category')
            .setDescriptionLocalizations({ uk: 'Голосовий канал або категорія' })
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory, ChannelType.GuildVoice)
        )
        .addStringOption((option) =>
          option.setName('label').setDescription('Dynamic channel name').setDescriptionLocalizations({ uk: 'Динамічна назва каналу' })
        )
    )
    .setDescriptionLocalizations({ uk: 'Налаштувати модуль журналу аудиту' }),
  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'set': {
        const channel = interaction.options.getChannel('channel') as VoiceChannel | CategoryChannel
        let label = interaction.options.getString('label')
        if (!label) label = t('config:defaultCounterName', { lng: interaction.guild?.preferredLocale })

        await Modules.updateOne({ guildId: interaction.guildId }, { counter: { channelId: channel.id, label } }, { upsert: true })

        return interaction.reply({
          content: t('config:counterChannelSet', { channel: channel.toString(), label, lng: interaction.locale }),
          ephemeral: true,
        })
      }
    }
  },
}

export default CounterSubcommandGroup
