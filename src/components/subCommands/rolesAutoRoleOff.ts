import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import Modules from '../../schemas/Modules'
import { t } from 'i18next'

const RolesAutoRoleSubcommandOff: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('autorole-off')
    .setDescription('Disable automatic role assignment when a member joins the server')
    .setDescriptionLocalizations({ uk: 'Вимкнути автоматичну видачу ролі, коли учасник приєднується до серверу' }),
  execute: async function (interaction) {
    const lng = interaction.locale

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'roles.autorole': null })

    interaction.reply({ content: t('config:autoRole.off', { lng }), ephemeral: true })
  },
}

export default RolesAutoRoleSubcommandOff
