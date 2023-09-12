import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'

const LevelingToggleSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('toggle')
    .setDescription('Toggle this module on/off')
    .addBooleanOption((option) => option.setName('state').setDescription('State').setDescriptionLocalizations({ uk: 'Стан' }).setRequired(true))
    .setDescriptionLocalizations({ uk: 'Увімкнути або вимкнути цей модуль' }),
  execute: async function (interaction) {
    const lng = interaction.locale
    const state = interaction.options.getBoolean('state') as boolean

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'leveling.status': state }, { upsert: true })

    interaction.reply({ content: state ? t('enabled', { lng }) : t('disabled', { lng }), ephemeral: true })
  },
}

export default LevelingToggleSubcommand
