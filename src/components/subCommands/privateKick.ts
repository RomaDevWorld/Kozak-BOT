import { GuildMember, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { getPrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const KickPrivateSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('kick')
    .setDescription('Deny a server member access to your channel')
    .setDescriptionLocalizations({ uk: 'Заборонити учаснику сервера доступ до Вашого каналу' })
    .addUserOption((option) =>
      option.setName('member').setDescription('Guild member').setDescriptionLocalizations({ uk: 'Учасник серверу' }).setRequired(true)
    ),
  execute: function (interaction) {
    const lng = interaction.locale
    const channel = getPrivateChannel(interaction.member as GuildMember)
    if (!channel) return interaction.reply({ content: t('privates:noChannel', { lng }), ephemeral: true })

    const member = interaction.options.getMember('member') as GuildMember
    if (!member) return interaction.reply({ content: t('memberNotFound', { lng }), ephemeral: true })
    if (member.user.id === interaction.user.id) return interaction.reply({ content: t('memberSelf', { lng }), ephemeral: true })

    channel?.permissionOverwrites.edit(member.id, {
      ViewChannel: false,
    })

    interaction.reply({ content: t('privates:kickSuccess', { lng, member: member.toString() }), ephemeral: true })
  },
}

export default KickPrivateSubcommand
