import { ButtonBuilder, ButtonStyle, GuildMember, VoiceChannel } from 'discord.js'
import { Button } from '../../@types/discord'
import { getPrivateChannel, restorePrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const RestorePrivate: Button = {
  button: new ButtonBuilder().setCustomId('private_restore').setStyle(ButtonStyle.Primary).setLabel('Restore'),
  execute: async (interaction) => {
    const lng = interaction.locale

    const memberChannel = await getPrivateChannel(interaction.member as GuildMember)

    if (!memberChannel || memberChannel.id !== interaction.channel?.id)
      return interaction.reply({ content: t('privates.restore.notOwner', { lng }), ephemeral: true })

    restorePrivateChannel(interaction.member as GuildMember, interaction.channel as VoiceChannel)

    interaction.message.edit({ components: [] }).catch((err: Error) => console.error(err))
    interaction.reply({ content: t('privates.restore.success', { lng }), ephemeral: true })
  },
}

export default RestorePrivate
