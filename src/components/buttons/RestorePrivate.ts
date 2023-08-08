import { ButtonBuilder, ButtonStyle, GuildMember, VoiceChannel } from 'discord.js'
import { Button } from '../../@types/discord'
import { getPrivateChannel, restorePrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const RestorePrivate: Button = {
  button: new ButtonBuilder().setCustomId('private_restore').setStyle(ButtonStyle.Primary).setLabel('Restore'),
  execute(interaction) {
    const lng = interaction.locale

    const memberChannel = getPrivateChannel(interaction.member as GuildMember)

    if (!memberChannel || memberChannel.id !== interaction.channel?.id)
      return interaction.reply({ content: t('private:restore.notOwner', { lng }), ephemeral: true })

    restorePrivateChannel(interaction.member as GuildMember, interaction.channel as VoiceChannel)

    interaction.message.edit({ components: [] }).catch((err) => console.error(err))
    interaction.reply({ content: t('private:restore.success', { lng }), ephemeral: true })
  },
}

export default RestorePrivate
