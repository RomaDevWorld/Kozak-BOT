import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import ModulesRanking from '../../schemas/Modules.Ranking'

export const LevelingRankingListSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('ranking-list')
    .setDescription('Show a list of roles linked to a level')
    .setDescriptionLocalizations({ uk: "Показати список ролей, прив'язаних до рівню" }),
  execute: async (interaction) => {
    const lng = interaction.locale

    const ranksData = await ModulesRanking.find({ guildId: interaction.guildId })

    const ranks: string[] = ranksData.sort((a, b) => a.lvl - b.lvl).map((r) => `**<@&${r.roleId}>** - ${r.lvl}`)

    const embed = {
      title: t('config:xp.ranking.list', { lng }),
      description: ranks.join('\n'),
      color: 0x00ff00,
    }

    interaction.reply({ embeds: [embed], ephemeral: true })
  },
}
export const LevelingRankingAddSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('ranking-add')
    .setDescription('Link a role to a level')
    .addIntegerOption((option) =>
      option
        .setName('level')
        .setDescription('Level to link to')
        .setDescriptionLocalizations({ uk: "Рівень для зв'язку" })
        .setRequired(true)
        .setMinValue(1)
    )
    .addRoleOption((option) =>
      option.setName('role').setDescription('Role to link').setRequired(true).setDescriptionLocalizations({ uk: "Роль для зв'язку" })
    )
    .setDescriptionLocalizations({ uk: "Прив'язати роль до рівню" }),
  execute: async (interaction) => {
    const lng = interaction.locale

    const lvl = interaction.options.getInteger('level')
    const role = interaction.options.getRole('role')
    if (!lvl || !role) return interaction.reply({ content: t('error', { lng }) })

    await ModulesRanking.findOneAndUpdate({ guildId: interaction.guildId, roleId: role.id }, { lvl }, { upsert: true })

    interaction.reply({ content: t('config:xp.ranking.add.success', { lng, role: role.toString(), lvl }), ephemeral: true })
  },
}
export const LevelingRankingRemoveSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('ranking-remove')
    .setDescription('Remove role to level linking')
    .addRoleOption((option) => option.setName('role').setDescription('Role to remove linking with').setRequired(true))
    .setDescriptionLocalizations({ uk: "Видалити зв'язок між рівнем та роллю" }),
  execute: async (interaction) => {
    const lng = interaction.locale

    const role = interaction.options.getRole('role')
    if (!role) return interaction.reply({ content: t('error', { lng }) })

    await ModulesRanking.findOneAndDelete({ guildId: interaction.guildId, roleId: role.id })

    interaction.reply({ content: t('config:xp.ranking.remove.success', { lng, role: role.name }), ephemeral: true })
  },
}
