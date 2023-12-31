import { EmbedBuilder, GuildMember, ImageURLOptions } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import { trackInvite } from '../../functions/trackInvites'
import timestamp from '../../functions/createTimestamp'

const GuildMemberAddLog = async (member: GuildMember) => {
  const channel = await validateLog(member.guild, 'guildMemberAdd')
  if (!channel) return

  const lng = member.guild.preferredLocale

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildMemberAdd.embed_author', { lng, user: member.user.username }),
      iconURL: member.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setDescription(
      `${member} (${member.user.username})\n${t('logs:guildMemberAdd.embed_description', { lng })}\n${timestamp(member.user.createdTimestamp, 'R')}`
    )
    .setFooter({ text: `ID: ${member.id}` })
    .setColor('Green')
    .setTimestamp()

  const invite = await trackInvite(member)
  if (invite) {
    const embedValue = [
      `**${t('code', { lng })}:** ${invite.code}`,
      `**${t('member_one', { lng })}:** ${invite.inviter?.toString()}`,
      `**${t('uses', { lng })}:** ${invite.maxUses ? `${invite.uses}/${invite.maxUses}` : invite.uses}`,
    ]

    embed.addFields({
      name: t('invite', { lng }),
      value: embedValue.join('\n'),
    })
  }

  channel.send({ embeds: [embed] })
}

export default GuildMemberAddLog
