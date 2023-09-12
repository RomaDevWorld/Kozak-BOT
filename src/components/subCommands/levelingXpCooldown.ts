import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'
import parseTime from '../../functions/parseTime'

const LevelingXpCooldownSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('xp-cooldown')
    .setDescription('Configure XP cooldown time')
    .setDescriptionLocalizations({ uk: 'Налаштувати час відновлення між отриманням досвіду' })
    .addStringOption((option) =>
      option.setName('time').setDescription('Time').setDescriptionLocalizations({ uk: 'Час' }).setRequired(true).setMaxLength(20)
    ),
  execute: async function (interaction) {
    const lng = interaction.locale

    const rawTime = interaction.options.getString('time')?.toLowerCase() as string
    const time = parseTime(rawTime)

    if (!time || time < 15 * 1000 || time > 5 * 60 * 1000)
      return interaction.reply({ content: t('config:xp.cooldown.invalidTime', { lng, value: rawTime }), ephemeral: true })

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'leveling.cooldown': time }, { upsert: true })

    interaction.reply({ content: t('config:xp.cooldown.success', { lng }), ephemeral: true })
  },
}

export default LevelingXpCooldownSubcommand
