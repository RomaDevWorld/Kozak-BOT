import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'
import LogTypeSwitch from '../buttons/LogTypeSwitch'

const LogSwitchesSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('switch')
    .setDescription('Switch state of different log events')
    .setDescriptionLocalizations({ uk: 'Перемикачі різних типів подій' }),
  execute: async (interaction) => {
    const lng = interaction.locale

    const data = await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { guildId: interaction.guildId }, { new: true, upsert: true })
    const types = data.log?.types

    const messageSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
      .setCustomId('switch_messages')
      .setStyle((types?.messageDelete, types?.messageDelete) ? ButtonStyle.Success : ButtonStyle.Danger)
      .setLabel(t('message_other', { lng }))

    const membersSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
      .setCustomId('switch_members')
      .setStyle((types?.guildMemberAdd, types?.guildMemberRemove) ? ButtonStyle.Success : ButtonStyle.Danger)
      .setLabel(t('member_other', { lng }))

    const voiceSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
      .setCustomId('switch_voices')
      .setStyle(types?.voiceStateUpdate ? ButtonStyle.Success : ButtonStyle.Danger)
      .setLabel(t('voice_channel_other', { lng }))

    const modSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
      .setCustomId('switch_mods')
      .setStyle(
        (types?.guildBanAdd,
        types?.guildBanRemove,
        types?.guildMemberTimeout,
        types?.guildMemberRolesUpdate,
        types?.guildMemberNicknameUpdate,
        types?.guildMemberWarn)
          ? ButtonStyle.Success
          : ButtonStyle.Danger
      )
      .setLabel(t('moderator', { lng }))

    const reportSwitch = new ButtonBuilder(LogTypeSwitch.button.data)
      .setCustomId('switch_reports')
      .setStyle((types?.messageDelete, types?.messageDelete) ? ButtonStyle.Success : ButtonStyle.Danger)
      .setLabel(t('report_other', { lng }))

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(messageSwitch, membersSwitch, voiceSwitch, modSwitch, reportSwitch)

    const embed = new EmbedBuilder()
      .setAuthor({ name: t('config:log.switches.author', { lng }), iconURL: interaction.guild?.iconURL() as string })
      .setDescription(t('config:log.switches.desc', { lng }))
      .setFooter({ text: t('config:log.switches.footer', { lng }) })
      .addFields({
        name: t('channel', { lng }),
        value: interaction.guild?.channels.cache.get(data.log?.channel as string)?.toString() ?? t('disabled', { lng }),
      })
      .setColor('Green')

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
  },
}

export default LogSwitchesSubcommand
