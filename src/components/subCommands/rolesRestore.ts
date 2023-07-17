import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'

const RolesRestoreSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('restore')
    .setDescription("Enable or Disable automatic restoration of member's roles and nickname on re-joining")
    .setDescriptionLocalizations({ uk: "Увімкнути або Вимкнути автоматичне відновлення ролей та нікнейму учасника при пере-під'єднанні" })
    .addBooleanOption((option) =>
      option.setName('toggle').setDescription('Toggle module state').setDescriptionLocalizations({ uk: 'Змінити статус модуля' }).setRequired(true)
    ),
  execute: async function (interaction) {
    const lng = interaction.locale
    const bool = interaction.options.getBoolean('toggle')

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'roles.restore': bool || false })

    interaction.reply({ content: t('config:roleRestore', { lng, status: t(bool ? 'enabled' : 'disabled', { lng }) }), ephemeral: true })
  },
}

export default RolesRestoreSubcommand
