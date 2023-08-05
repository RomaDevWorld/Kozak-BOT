import { GuildMember, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { getPrivateChannel } from '../../functions/usePrivateChannel'
import { t } from 'i18next'

const PrivateManageRenameSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('rename')
    .setDescription('Rename your private channel')
    .setDescriptionLocalizations({ uk: 'Перейменувати ваш приватний канал' })
    .addStringOption((option) =>
      option.setName('name').setDescription('New name').setDescriptionLocalizations({ uk: 'Нова назва каналу' }).setRequired(true).setMaxLength(50)
    ),
  execute: function (interaction) {
    const lng = interaction.locale

    const channel = getPrivateChannel(interaction.member as GuildMember)
    if (!channel) return interaction.reply({ content: t('private:noChannel', { lng }), ephemeral: true })
    if (!interaction.guild) return

    const name = interaction.options.getString('name') as string
    channel.setName(name)

    interaction.reply({ content: t('private:channelRenamed', { lng, name }), ephemeral: true })
  },
}

export default PrivateManageRenameSubcommand
