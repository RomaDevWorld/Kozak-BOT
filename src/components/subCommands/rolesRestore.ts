import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'
import parseTime from '../../functions/parseTime'

const RolesRestoreSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('restore')
    .setDescription("Enable or Disable automatic restoration of member's roles and nickname on re-joining")
    .setDescriptionLocalizations({ uk: "Увімкнути або Вимкнути автоматичне відновлення ролей та нікнейму учасника при пере-під'єднанні" })
    .addBooleanOption((option) =>
      option.setName('toggle').setDescription('Toggle module state').setDescriptionLocalizations({ uk: 'Змінити статус модуля' }).setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('expire')
        .setDescription('Recovery data expiration date (1m/h/d)')
        .setDescriptionLocalizations({ uk: 'Термін дії даних про відновлення (1m/h/d)' })
    ),
  execute: async function (interaction) {
    const lng = interaction.locale
    const bool = interaction.options.getBoolean('toggle')

    let time = parseTime(interaction.options.getString('expire') || '7d')
    if (!time) time = 86400000 * 7

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'roles.restore': { status: bool, expireTime: time } })

    interaction.reply({ content: t('config:roleRestore', { lng, status: t(bool ? 'enabled' : 'disabled', { lng }) }), ephemeral: true })
  },
}

export default RolesRestoreSubcommand
