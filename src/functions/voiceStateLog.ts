import { VoiceState } from 'discord.js'
import VoiceChannelJoin from '../components/logs/VoiceChannelJoin'
import VoiceChannelLeave from '../components/logs/VoiceChannelLeave'
import VoiceChannelMove from '../components/logs/VoiceChannelMove'

const voiceStateLog = async (oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  if (oldVoiceState.member?.user.bot) return
  if (oldVoiceState.channel?.id === newVoiceState.channel?.id) return

  if (!oldVoiceState.channel && newVoiceState.channel) {
    VoiceChannelJoin(oldVoiceState, newVoiceState)
  } else if (oldVoiceState.channel && !newVoiceState.channel) {
    VoiceChannelLeave(oldVoiceState, newVoiceState)
  } else if (oldVoiceState.channel && newVoiceState.channel) {
    VoiceChannelMove(oldVoiceState, newVoiceState)
  }
}
export default voiceStateLog
