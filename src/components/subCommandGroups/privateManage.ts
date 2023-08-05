import { GuildMember, PermissionFlagsBits, SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import { getPrivateChannel, removePrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const ManagePrivateSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('manage')
    .setDescription('Manage private channel')
    .setDescriptionLocalizations({ uk: 'Керувати особистим каналом' })
    .addSubcommand((sub) =>
      sub
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
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('public')
        .setDescription('Make the channel public or private')
        .setDescriptionLocalizations({ uk: 'Зробити канал відкритим або особистим' })
    )
    .addSubcommand((sub) =>
      sub.setName('delete').setDescription('Delete your private channel').setDescriptionLocalizations({ uk: 'Видалити ваш особистий канал' })
    )
    .addSubcommand((sub) =>
      sub
        .setName('rename')
        .setDescription('Rename your private channel')
        .setDescriptionLocalizations({ uk: 'Перейменувати ваш приватний канал' })
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('New name')
            .setDescriptionLocalizations({ uk: 'Нова назва каналу' })
            .setRequired(true)
            .setMaxLength(50)
        )
    ),

  execute: async function (interaction) {
    const lng = interaction.locale

    const channel = getPrivateChannel(interaction.member as GuildMember)
    if (!channel) return interaction.reply({ content: t('private:noChannel', { lng }), ephemeral: true })
    if (!interaction.guild) return

    switch (interaction.options.getSubcommand()) {
      case 'limit': {
        const limit = interaction.options.getInteger('limit') as number

        channel.setUserLimit(limit)

        interaction.reply({ content: t('private:limitUpdated', { lng, limit }), ephemeral: true })

        break
      }
      case 'public': {
        const isOn = channel.permissionsFor(interaction.guild?.id)?.has(PermissionFlagsBits.ViewChannel) ?? false

        channel.permissionOverwrites.edit(interaction.guild?.id, {
          ViewChannel: !isOn,
        })

        interaction.reply({ content: t('private:publicUpdated', { lng }), ephemeral: true })
        break
      }
      case 'delete': {
        removePrivateChannel(interaction.member as GuildMember)

        interaction.reply({ content: t('private:channelDeleted', { lng }), ephemeral: true })
        break
      }
      case 'rename': {
        const name = interaction.options.getString('name') as string
        channel.setName(name)

        interaction.reply({ content: t('private:channelRenamed', { lng, name }), ephemeral: true })
        break
      }
    }
  },
}

export default ManagePrivateSubcommandGroup
