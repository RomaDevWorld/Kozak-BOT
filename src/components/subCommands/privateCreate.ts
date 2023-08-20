import { GuildMember, SlashCommandSubcommandBuilder, VoiceChannel } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'
import { createPrivateChannel, getPrivateChannel, removePrivateChannel, timeouts } from '../../functions/usePrivateChannel'

const CreatePrivateSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create or Recreate your private channel')
    .setDescriptionLocalizations({ uk: 'Створити або Пере-створити ваш приватний канал' }),
  execute: async (interaction) => {
    const lng = interaction.locale

    const data = await Modules.findOne({ guildId: interaction.guildId })
    const lobbyChannel = interaction.guild?.channels.cache.get(data?.lobby?.channel as string) as VoiceChannel

    if (!data || !data.lobby?.channel || !lobbyChannel) return interaction.reply({ content: t('privates:moduleOff', { lng }), ephemeral: true })

    const existingChannel = await getPrivateChannel(interaction.member as GuildMember)
    if (existingChannel) existingChannel.delete()

    const channel = await createPrivateChannel(interaction.member as GuildMember, lobbyChannel)
    if (!channel) return interaction.reply({ content: t('error', { lng }), ephemeral: true })

    interaction.reply({ content: t('privates:channelCreated', { lng, channel: channel.toString() }), ephemeral: true })

    timeouts[channel.id] = setTimeout(() => {
      interaction.followUp({ content: t('privates:channelExpired', { lng }), ephemeral: true }).catch((err) => console.error(err))

      removePrivateChannel(interaction.member as GuildMember)
      clearTimeout(timeouts[channel.id])
      delete timeouts[channel.id]
    }, 60000 * 5)
  },
}

export default CreatePrivateSubcommand
