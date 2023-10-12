import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'

const LogChannelRemoveSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('channel-remove')
    .setDescription('Remove data about log channel')
    .setDescriptionLocalizations({ uk: 'Вилучити дані про канал журналу аудиту' }),
  execute: async (interaction) => {
    const lng = interaction.locale

    await Modules.updateOne({ guildId: interaction.guildId }, { 'log.channel': null }, { upsert: true })

    return interaction.reply({
      content: t('config:log.channel.remove', { lng }),
      ephemeral: true,
    })
  },
}

export default LogChannelRemoveSubcommand
