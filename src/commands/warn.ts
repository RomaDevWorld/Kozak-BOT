import { EmbedBuilder, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'
import Warns from '../schemas/Warns'
import timestamp from '../functions/createTimestamp'
import GuildMemberWarnLog from '../components/logs/GuildMemberWarn'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('warn')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription("List all member's warns")
        .setDescriptionLocalizations({ uk: 'Список попереджень учасника' })
        .addUserOption((option) => option.setName('member').setDescription('Member').setDescriptionLocalizations({ uk: 'Учасник' }).setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('push')
        .setDescription('Push warn to member')
        .setDescriptionLocalizations({ uk: 'Надіслати попередження учаснику' })
        .addUserOption((option) => option.setName('member').setDescription('Member').setDescriptionLocalizations({ uk: 'Учасник' }).setRequired(true))
        .addStringOption((option) =>
          option.setName('reason').setDescription('Reason to warn').setDescriptionLocalizations({ uk: 'Причина попередження' })
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('clear')
        .setDescription("Clear member's warn list")
        .setDescriptionLocalizations({ uk: 'Очистити список попереджень учасника' })
        .addUserOption((option) => option.setName('member').setDescription('Member').setDescriptionLocalizations({ uk: 'Учасник' }).setRequired(true))
        .addStringOption((option) =>
          option.setName('reason').setDescription('Comment to clear').setDescriptionLocalizations({ uk: 'Коментар до очищення' })
        )
    )
    .setDescription('Warning to the member about violations')
    .setDescriptionLocalizations({ uk: 'Попередження учаснику про порушення' })
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
  cooldown: 10,
  install: {
    integration_types: [0],
    contexts: [0]
  },
  execute: async (interaction) => {
    const lng = interaction.locale

    const member = interaction.guild?.members.cache.get(interaction.options.getUser('member')?.id as string)
    const reason = interaction.options.getString('reason')

    if (!member) return interaction.reply({ content: t('memberNotFound', { lng }), ephemeral: true })
    if (member.user.bot) return interaction.reply({ content: t('memberBot', { lng }), ephemeral: true })
    if (member.user.id === interaction.user.id) return interaction.reply({ content: t('memberSelf', { lng }), ephemeral: true })

    const data = await Warns.findOne({ guildId: interaction.guildId, userId: member.id })

    switch (interaction.options.getSubcommand()) {
      case 'list': {
        const warnList = data?.warns.map(
          (i) => `**${timestamp(i.dateTimestamp, 'd')} ${timestamp(i.dateTimestamp, 't')}:** ${i.reason}\n(<@${i.modId}>)`
        )

        const embed = new EmbedBuilder()
          .setAuthor({
            name: t('warn.list.embed_author', { lng, member: member.user.username }),
            iconURL: member.user.displayAvatarURL(),
          })
          .setDescription(warnList?.join('\n') || ' ')
          .setFooter({
            text: t('warn.list.embed_footer', { lng, value: warnList?.length || 0 }),
            iconURL: interaction.guild?.iconURL() || undefined,
          })
          .setColor('Orange')

        interaction.reply({ embeds: [embed], ephemeral: true })
        break
      }
      case 'push': {
        const data = await Warns.findOneAndUpdate(
          { guildId: interaction.guildId, userId: member.id },
          { $push: { warns: { dateTimestamp: Date.now(), reason, modId: interaction.user.id } } },
          { new: true, upsert: true }
        )

        const embed = new EmbedBuilder()
          .setAuthor({ name: t('warn.push.embed_author', { lng }) })
          .setDescription(t('warn.push.embed_description', { lng, reason: reason || t('reasonNotSpecified', { lng }) }))
          .setColor('Green')
          .setFooter({
            text: t('warn.list.embed_footer', {
              lng,
              value: data?.warns.length as number,
            }),
          })

        interaction.reply({ embeds: [embed], ephemeral: true })

        await GuildMemberWarnLog(member, interaction.member as GuildMember, data.warns.length, reason)
        break
      }
      case 'clear': {
        await Warns.findOneAndDelete({ guildId: interaction.guildId, userId: member.id })

        return interaction.reply({ content: t('warn.clear.success', { lng, member: member.user.username }), ephemeral: true })
      }
    }
  },
}

export default command
