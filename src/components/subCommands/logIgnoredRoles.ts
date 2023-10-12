import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'

const cmd = new SlashCommandSubcommandBuilder()
  .setName('ignored-roles')
  .setDescription('Specify up to 10 ignored roles')
  .setDescriptionLocalizations({ uk: 'Вкажіть до 10 ролей, власники якої не будуть вказані в журналі аудиту' })

for (let i = 0; i < 10; i++) {
  cmd.addRoleOption((option) =>
    option
      .setName(`role-${i}`)
      .setDescriptionLocalizations({ uk: `Роль ${i + 1}` })
      .setDescription('Role to ignore')
  )
}

const LogIgnoredRolesSubcommand: SubCommand = {
  data: cmd,
  execute: async (interaction) => {
    const lng = interaction.locale

    const roles: string[] = []
    for (let i = 0; i <= 10; i++) {
      const option = interaction.options.getRole(`role-${i}`)
      if (option && !roles.includes(option.id) && option.id !== interaction.guild?.id) roles.push(option.id)
    }

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'log.ignoredRoles': roles }, { upsert: true })

    interaction.reply({
      content: t('config:xp.ignoredRoles.success', { lng, roles: roles.map((i) => `<@&${i}>`).join(`\n`) }),
      ephemeral: true,
    })
  },
}

export default LogIgnoredRolesSubcommand
