import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'
import LogTypeSwitch from '../buttons/LogTypeSwitch'

const ConfigLogSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('log')
    .setDescription('Configure logging module')
    .setDescriptionLocalizations({ uk: 'Налаштувати модуль журналу аудиту' })
    .addSubcommand((sub) =>
      sub
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
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('switch')
        .setDescription('Switch state of different log events')
        .setDescriptionLocalizations({ uk: 'Перемикачі різних типів подій' })
    ),
  execute: async function (interaction) {
    const data = await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { guildId: interaction.guildId }, { new: true, upsert: true })
    const lng = interaction.locale

    switch (interaction.options.getSubcommand()) {
      case 'channel': {
        const channel = interaction.options.getChannel('channel')
        data.log.channel = channel?.id as string
        data.save()

        return interaction.reply({
          content: t('config:logChannelSet', { lng: interaction.locale, channel: channel?.toString() }),
          ephemeral: true,
        })
      }
      case 'switch': {
        const data = await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { guildId: interaction.guildId }, { new: true, upsert: true })
        const types = data.log.types

        const messageSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
          .setCustomId('switch_messages')
          .setStyle((types.messageDelete, types.messageDelete) ? ButtonStyle.Success : ButtonStyle.Danger)
          .setLabel(t('message_other', { lng }))

        const membersSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
          .setCustomId('switch_members')
          .setStyle((types.guildMemberAdd, types.guildMemberRemove) ? ButtonStyle.Success : ButtonStyle.Danger)
          .setLabel(t('member_other', { lng }))

        const voiceSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
          .setCustomId('switch_voices')
          .setStyle(types.voiceStateUpdate ? ButtonStyle.Success : ButtonStyle.Danger)
          .setLabel(t('voice_channel_other', { lng }))

        const modSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
          .setCustomId('switch_mods')
          .setStyle(
            (types.guildBanAdd, types.guildBanRemove, types.guildMemberTimeout, types.guildMemberRolesUpdate, types.guildMemberNicknameUpdate)
              ? ButtonStyle.Success
              : ButtonStyle.Danger
          )
          .setLabel(t('moderator', { lng }))

        const reportSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
          .setCustomId('switch_reports')
          .setStyle((types.messageDelete, types.messageDelete) ? ButtonStyle.Success : ButtonStyle.Danger)
          .setLabel(t('report_other', { lng }))

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(messageSwitch, membersSwitch, voiceSwitch, modSwitch, reportSwitch)

        const embed = new EmbedBuilder()
          .setAuthor({ name: t('config:logSwitches_author', { lng }), iconURL: interaction.guild?.iconURL() as string })
          .setDescription(t('config:logSwitches_desc', { lng }))
          .setFooter({ text: t('config:logSwitches_footer', { lng }) })
          .addFields({
            name: t('channel', { lng }),
            value: interaction.guild?.channels.cache.get(data.log.channel as string)?.toString() ?? t('disabled', { lng }),
          })
          .setColor('Green')

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })

        break
      }
    }
  },
}

export default ConfigLogSubcommandGroup
