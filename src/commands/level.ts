import { EmbedBuilder, GuildMember, ImageURLOptions, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../@types/discord'
import XPs from '../schemas/XPs'
import { t } from 'i18next'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Shows XP')
    .addUserOption((option) =>
      option.setName('member').setDescription('Member to show XP').setDescriptionLocalizations({ uk: 'Учасник, щоб показати досвід' })
    )
    .setDescriptionLocalizations({
      uk: 'Показати очки досвіду',
    }),
  cooldown: 10,
  execute: async (interaction) => {
    const lng = interaction.locale

    const member = interaction.guild?.members.cache.get(interaction.options.getUser('member')?.id as string) || (interaction.member as GuildMember)

    const data = await XPs.findOne({ guildId: interaction.guildId, memberId: member.id })
    if (!data) return interaction.reply({ content: t('xp.level.no_data', { lng }), ephemeral: true })

    const embed = new EmbedBuilder()
      .setAuthor({
        name: t('xp.level.author', { lng, member: member.user.username }),
        iconURL: member.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
      })
      .setColor('Green')
      .addFields(
        { name: t('xp.level.fields.xp', { lng }), value: data.xp.toString(), inline: true },
        { name: t('xp.level.fields.level', { lng }), value: Math.floor(data.xp / 100).toString(), inline: true }
      )
      .setTimestamp()

    interaction.reply({ embeds: [embed], ephemeral: true })
  },
}

export default command
