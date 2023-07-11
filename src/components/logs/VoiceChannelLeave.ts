import { EmbedBuilder, VoiceState } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { getFollowUp, removeFollowUp } from '../../functions/voiceLogFollowUp'
import { t } from 'i18next'

const VoiceChannelLeave = async (oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  const channel = await validateLog(newVoiceState.guild, 'voiceStateUpdate')
  if (!channel) return

  const followUp = await getFollowUp(newVoiceState.id, channel)
  if (followUp && followUp.embeds.length > 0) {
    // Extend existing message
    const embed = new EmbedBuilder()
      .setAuthor({ name: followUp.embeds[0].author?.name as string, iconURL: newVoiceState.member?.user.displayAvatarURL() })
      .setDescription(
        followUp.embeds[0].description +
          '\n' +
          `**${t('logs:voiceChannelLeaveTime', {
            lng: newVoiceState.guild.preferredLocale,
            channel: oldVoiceState.channel?.name,
            time: new Date(Date.now() - followUp.createdTimestamp).toISOString().slice(11, 19),
          })}**`
      )
      .setTimestamp()
      .setFooter({ text: `ID: ${newVoiceState.id}` })

    followUp.edit({ embeds: [embed] })
  } else {
    // Create new message
    const embed = new EmbedBuilder()
      .setAuthor({ name: newVoiceState.member?.user.username as string, iconURL: newVoiceState.member?.user.displayAvatarURL() })
      .setDescription(`**${t('logs:voiceChannelLeave', { lng: newVoiceState.guild.preferredLocale, channel: oldVoiceState.channel?.name })}**`)
      .setTimestamp()
      .setFooter({ text: `ID: ${newVoiceState.id}` })
    channel.send({ embeds: [embed] })
  }

  removeFollowUp(newVoiceState.id)
}

export default VoiceChannelLeave
