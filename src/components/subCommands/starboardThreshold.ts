import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'

const StarboardThresholdSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('threshold')
    .setDescription('Set minimum reactions on message for it to be sent to starboard')
    .addIntegerOption((option) =>
      option
        .setName('number')
        .setDescription('Number')
        .setDescriptionLocalizations({ uk: 'Число' })
        .setMinValue(3)
        .setMaxValue(1000)
        .setRequired(true)
    )
    .setDescriptionLocalizations({ uk: 'Мінімальна кількість реакцій на повідомлення, необхідне для потрапляння в старборд' }),
  execute: async function (interaction) {
    const lng = interaction.locale
    const number = interaction.options.getInteger('number') as number

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'starboard.threshold': number }, { upsert: true })

    interaction.reply({ content: t('config:starboard.threshold.success', { lng }), ephemeral: true })
  },
}

export default StarboardThresholdSubcommand
