import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'

const LevelingNotificationsToggleSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('notify')
    .setDescription('Toggle notification on level up')
    .addBooleanOption((option) => option.setName('state').setDescription('State').setDescriptionLocalizations({ uk: 'Стан' }).setRequired(true))
    .setDescriptionLocalizations({ uk: 'Увімкнути або вимкнути сповіщення при підвищенні рівня' }),
  execute: async function (interaction) {
    const lng = interaction.locale
    const state = interaction.options.getBoolean('state') as boolean

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'leveling.notifications.onLvlUp': state }, { upsert: true })

    interaction.reply({ content: state ? t('enabled', { lng }) : t('disabled', { lng }), ephemeral: true })
  },
}

export default LevelingNotificationsToggleSubcommand
