import { EmbedBuilder, ImageURLOptions, VoiceState } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { getFollowUp, saveFollowUp } from '../../functions/voiceLogFollowUp'
import { t } from 'i18next'

const VoiceChannelMove = async (oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  if (!oldVoiceState.member || !newVoiceState.member) return
  if (!oldVoiceState.channel || !newVoiceState.channel) return

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
      .setDescription(followUp.embeds[0].description + '\n' + `=> #${newVoiceState.channel?.name}`)
      .setTimestamp()
      .setFooter({ text: `ID: ${newVoiceState.id}` })

    followUp.edit({ embeds: [embed] })
  } else {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: newVoiceState.member?.user.username as string,
        iconURL: newVoiceState.member?.user.displayAvatarURL({ dynamic: true } as ImageURLOptions),
      })
      .setDescription(
        `**${t('logs:voiceChannel.Lost', { lng: newVoiceState.guild.preferredLocale })}**` +
          `\n` +
          `=> #${oldVoiceState.channel?.name}` +
          `\n` +
          `=> #${newVoiceState.channel?.name}`
      )
      .setFooter({ text: `ID: ${newVoiceState.id}` })
      .setTimestamp()

    const message = await channel.send({ embeds: [embed] })

    saveFollowUp(newVoiceState.id, message)
  }
}

export default VoiceChannelMove
