import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'

const LevelingXpAmountSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('xp-amount')
    .setDescription('Configure how many xp give per message')
    .setDescriptionLocalizations({ uk: 'Налаштувати як багато досвіду буде видано за повідомлення' })
    .addNumberOption((option) =>
      option
        .setName('min')
        .setDescription('Minimal xp')
        .setMinValue(0)
        .setRequired(true)
        .setMaxValue(10000)
        .setDescriptionLocalizations({ uk: 'Мінімальна кількість досвіду' })
    )
    .addNumberOption((option) =>
      option
        .setName('max')
        .setDescription('Maximal xp')
        .setMinValue(1)
        .setRequired(true)
        .setMaxValue(20000)
        .setDescriptionLocalizations({ uk: 'Максимальна кількість досвіду' })
    ),
  execute: async function (interaction) {
    const lng = interaction.locale
    const min = interaction.options.getNumber('min') as number
    const max = interaction.options.getNumber('max') as number

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'leveling.minXp': min, 'leveling.maxXp': max }, { upsert: true })

    interaction.reply({ content: t('config:xp.amount.success', { lng }), ephemeral: true })
  },
}

export default LevelingXpAmountSubcommand
