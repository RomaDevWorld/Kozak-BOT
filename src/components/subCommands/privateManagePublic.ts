import { GuildMember, PermissionFlagsBits, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { getPrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const PrivateManagePublicSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('public')
    .setDescription('Make the channel public or private')
    .setDescriptionLocalizations({ uk: 'Зробити канал відкритим або особистим' }),
  execute: function (interaction) {
    const lng = interaction.locale

    const channel = getPrivateChannel(interaction.member as GuildMember)
    if (!channel) return interaction.reply({ content: t('privates:noChannel', { lng }), ephemeral: true })
    if (!interaction.guild) return

    const isOn = channel.permissionsFor(interaction.guild?.id)?.has(PermissionFlagsBits.ViewChannel) ?? false

    channel.permissionOverwrites.edit(interaction.guild?.id, {
      ViewChannel: !isOn,
    })

    interaction.reply({ content: t('privates:publicUpdated', { lng }), ephemeral: true })
  },
}

export default PrivateManagePublicSubcommand
