import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { t } from 'i18next'
import { SlashCommand } from '../@types/discord'
import Warns from '../schemas/Warns'
import moment from 'moment'

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
  execute: async (interaction) => {
    const member = interaction.guild?.members.cache.get(interaction.options.getUser('member')?.id as string)
    const reason = interaction.options.getString('reason')

    if (!member) return interaction.reply({ content: t('memberNotFound', { lng: interaction.locale }), ephemeral: true })
    if (member.user.bot) return interaction.reply({ content: t('memberBot', { lng: interaction.locale }), ephemeral: true })

    const data = await Warns.findOne({ guildId: interaction.guildId, userId: member.id })

    switch (interaction.options.getSubcommand()) {
      case 'list': {
        const warnList = data?.warns.map((i) => `**${moment(i.dateTimestamp).format('DD.MM.YYYY HH:mm')}:** ${i.reason}\n(<@${i.modId}>)`)

        const embed = new EmbedBuilder()
          .setAuthor({
            name: t('warn:list_embed_author', { lng: interaction.locale, member: member.user.username }),
            iconURL: member.user.displayAvatarURL(),
          })
          .setDescription(warnList?.join('\n') || ' ')
          .setFooter({
            text: t('warn:list_embed_footer', { lng: interaction.locale, value: warnList?.length || 0 }),
            iconURL: interaction.guild?.iconURL() || ' ',
          })
          .setColor('Orange')

        interaction.reply({ embeds: [embed], ephemeral: true })
        break
      }
      case 'push': {
        await Warns.findOneAndUpdate(
          { guildId: interaction.guildId, userId: member.id },
          { $push: { warns: { dateTimestamp: Date.now(), reason, modId: interaction.user.id } } },
          { new: true, upsert: true }
        )

        const embed = new EmbedBuilder()
          .setAuthor({ name: t('warn:push_embed_author', { lng: interaction.locale }) })
          .setDescription(
            t('warn:push_embed_description', { lng: interaction.locale, reason: reason || t('reasonNotSpecified', { lng: interaction.locale }) })
          )
          .setColor('Green')
          .setFooter({
            text: t('warn:list_embed_footer', {
              lng: interaction.locale,
              value: data?.warns.length || 0,
            }),
          })

        interaction.reply({ embeds: [embed], ephemeral: true })
        break
      }
      case 'clear': {
        await Warns.findOneAndDelete({ guildId: interaction.guildId, userId: member.id })

        return interaction.reply({ content: t('warn:clear_success', { lng: interaction.locale, member: member.user.username }), ephemeral: true })
      }
    }
  },
}

export default command
