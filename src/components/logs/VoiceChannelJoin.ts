import { EmbedBuilder, ImageURLOptions, VoiceState } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'
import { saveFollowUp } from '../../functions/voiceLogFollowUp'

const VoiceChannelJoin = async (oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  if (!oldVoiceState.member || !newVoiceState.member) return
  if (!newVoiceState.channel) return

  const channel = await validateLog(newVoiceState.guild, 'voiceStateUpdate', undefined, newVoiceState.member)
  if (!channel) return

  const embed = new EmbedBuilder()
    .setAuthor({
      name: newVoiceState.member.user.username,
      iconURL: newVoiceState.member.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
    })
    .setDescription(`**${t('logs:voiceChannel.Join', { lng: newVoiceState.guild.preferredLocale, channel: newVoiceState.channel?.name })}**`)
    .setTimestamp()
    .setFooter({ text: `ID: ${newVoiceState.member.id}` })

  const message = await channel.send({ embeds: [embed] })

  saveFollowUp(newVoiceState.id, message)
}

export default VoiceChannelJoin
