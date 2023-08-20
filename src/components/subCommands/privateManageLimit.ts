import { GuildMember, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { getPrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const PrivateManageLimitSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('limit')
    .setDescription('Set a limit on the number of members in your channel (Useful if the channel is public)')
    .setDescriptionLocalizations({ uk: 'Встановити ліміт на кількість учасників у вашому каналі (Корисно якщо канал публічний)' })
    .addIntegerOption((option) =>
      option
        .setName('limit')
        .setDescription('Limit of members')
        .setDescriptionLocalizations({ uk: 'Ліміт учасників' })
        .setMinValue(2)
        .setMaxValue(99)
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const lng = interaction.locale

    const channel = await getPrivateChannel(interaction.member as GuildMember)
    if (!channel) return interaction.reply({ content: t('privates:noChannel', { lng }), ephemeral: true })
    if (!interaction.guild) return

    const limit = interaction.options.getInteger('limit') as number

    channel.setUserLimit(limit)

    interaction.reply({ content: t('privates:limitUpdated', { lng, limit }), ephemeral: true })
  },
}

export default PrivateManageLimitSubcommand
