import { GuildMember, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { getPrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const InvitePrivateSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('invite')
    .setDescription('Grant server member access to your channel')
    .setDescriptionLocalizations({ uk: 'Надати учаснику сервера доступ до Вашого каналу' })
    .addUserOption((option) =>
      option.setName('member').setDescription('Guild member').setDescriptionLocalizations({ uk: 'Учасник серверу' }).setRequired(true)
    ),
  execute: async (interaction) => {
    const lng = interaction.locale
    const channel = await getPrivateChannel(interaction.member as GuildMember)
    if (!channel) return interaction.reply({ content: t('privates.noChannel', { lng }), ephemeral: true })

    const member = interaction.options.getMember('member') as GuildMember
    if (!member) return interaction.reply({ content: t('memberNotFound', { lng }), ephemeral: true })
    if (member.user.id === interaction.user.id) return interaction.reply({ content: t('memberSelf', { lng }), ephemeral: true })

    channel?.permissionOverwrites.edit(member.id, {
      ViewChannel: true,
    })

    interaction.reply({ content: t('privates.inviteSuccess', { lng, member: member.toString() }), ephemeral: true })
  },
}

export default InvitePrivateSubcommand
