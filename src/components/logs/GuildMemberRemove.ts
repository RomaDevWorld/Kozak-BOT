import { EmbedBuilder, GuildMember } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'

const GuildMemberRemoveLog = async (member: GuildMember) => {
  const channel = await validateLog(member.guild, 'guildMemberRemove')
  if (!channel) return

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberRemove_embed_author', { lng: member.guild.preferredLocale, user: member.user.username }),
      iconURL: member.displayAvatarURL(),
    })
    .setDescription(`${member} (${member.user.username})`)
    .setFooter({ text: `ID: ${member.id}` })
    .setColor('Orange')
    .setTimestamp()

  channel.send({ embeds: [embed] })
}

export default GuildMemberRemoveLog
