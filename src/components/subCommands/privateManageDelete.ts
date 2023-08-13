import { GuildMember, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { getPrivateChannel, removePrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const PrivateManageDeleteSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete your private channel')
    .setDescriptionLocalizations({ uk: 'Видалити ваш особистий канал' }),
  execute: function (interaction) {
    const lng = interaction.locale

    const channel = getPrivateChannel(interaction.member as GuildMember)
    if (!channel) return interaction.reply({ content: t('privates:noChannel', { lng }), ephemeral: true })
    if (!interaction.guild) return

    removePrivateChannel(interaction.member as GuildMember)

    interaction.reply({ content: t('privates:channelDeleted', { lng }), ephemeral: true })
  },
}

export default PrivateManageDeleteSubcommand
