import { EmbedBuilder, ImageURLOptions, VoiceState } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { getFollowUp, removeFollowUp } from '../../functions/voiceLogFollowUp'
import { t } from 'i18next'

const VoiceChannelLeave = async (oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  if (!oldVoiceState.member || !newVoiceState.member) return
  if (!oldVoiceState.channel) return

  const channel = await validateLog(newVoiceState.guild, 'voiceStateUpdate', undefined, newVoiceState.member)
  if (!channel) return

  const followUp = await getFollowUp(newVoiceState.id, channel)
  if (followUp && followUp.embeds.length > 0) {
    // Extend existing message
    const embed = new EmbedBuilder()
      .setAuthor({
        name: followUp.embeds[0].author?.name as string,
        iconURL: newVoiceState.member?.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
      })
      .setDescription(
        followUp.embeds[0].description +
          '\n' +
          `**${t('logs:voiceChannel.LeaveTime', {
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
      .setAuthor({
        name: newVoiceState.member?.user.username as string,
        iconURL: newVoiceState.member?.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
      })
      .setDescription(`**${t('logs:voiceChannel.Leave', { lng: newVoiceState.guild.preferredLocale, channel: oldVoiceState.channel?.name })}**`)
      .setTimestamp()
      .setFooter({ text: `ID: ${newVoiceState.id}` })
    channel.send({ embeds: [embed] })
  }

  removeFollowUp(newVoiceState.id)
}

export default VoiceChannelLeave
