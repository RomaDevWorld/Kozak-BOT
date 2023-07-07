import { GuildMemberRoleManager, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'
import parseTime from '../functions/parseTime'
import moment from 'moment'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout member')
    .setDescriptionLocalizations({ uk: 'Тимчасово заборонити учаснику сервера відправляти повідомлення та заходити в голосові канали' })
    .addUserOption((option) =>
      option.setName('member').setDescription('Member to timeout').setDescriptionLocalizations({ uk: 'Користувач для обмеження' }).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('time').setDescription('Time (1s/m/h/d)').setDescriptionLocalizations({ uk: 'Час (1d/m/h/d)' }).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Additional reason for timeout').setDescriptionLocalizations({ uk: 'Причина обмеження' })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
  cooldown: 10,
  execute: async (interaction) => {
    const member = interaction.guild?.members.cache.get(interaction.options.getUser('member')?.id as string)
    if (!member) return interaction.reply({ content: t('mute:member_notFound', { lng: interaction.locale }), ephemeral: true })

    if (!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.MuteMembers)) {
      return interaction.reply({ content: t('mute:bot_noPermission', { lng: interaction.locale }), ephemeral: true })
    }

    if (
      member.permissions.has(PermissionFlagsBits.Administrator) ||
      member.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position
    ) {
      return interaction.reply({ content: t('mute:member_greater', { lng: interaction.locale }), ephemeral: true })
    }

    const rawTime = interaction.options.getString('time')?.toLowerCase() as string
    const time = parseTime(rawTime)

    if (isNaN(time) || time < 1 || time > 2419200 * 1000) {
      return interaction.reply({ content: t('mute:time_incorrect', { lng: interaction.locale, value: rawTime }), ephemeral: true })
    }

    try {
      member.timeout(
        time,
        `${interaction.user.username}: ${
          interaction.options.getString('reason') || t('mute:defaultReason', { lng: interaction.guild?.preferredLocale })
        }`
      )

      return await interaction.reply({
        content: t('mute:success', {
          lng: interaction.locale,
          member: member.user.username,
          date: moment(Date.now() + time).format('HH:mm:ss DD.MM.YYYY'),
        }),
        ephemeral: true,
      })
    } catch (error) {
      console.error(error)
      return interaction.reply({ content: t('common:error', { lng: interaction.locale }), ephemeral: true })
    }
  },
}

export default command
