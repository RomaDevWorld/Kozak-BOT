import { ChannelType, SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import Modules from '../../schemas/Modules'

const ConfigLogSubcommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('log')
    .setDescription('Configure logging module')
    .setDescriptionLocalizations({ uk: 'Налаштувати модуль журналу аудиту' })
    .addSubcommand((sub) =>
      sub
        .setName('channel')
        .setDescription('Configure log channel')
        .setDescriptionLocalizations({ uk: 'Налаштувати канал для повідомлень журналу аудиту' })
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Select text channel')
            .setDescriptionLocalizations({ uk: 'Оберіть текстовий канал' })
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    ),
  execute: async function (interaction) {
    const data = await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { guildId: interaction.guildId }, { new: true, upsert: true })

    switch (interaction.options.getSubcommand()) {
      case 'channel': {
        data.log.channel = interaction.options.getChannel('channel')?.id as string
        data.save()

        return interaction.reply({ content: 'Log channel set', ephemeral: true })
      }
    }
  },
}

export default ConfigLogSubcommandGroup
