import { VoiceState } from 'discord.js'
import { BotEvent } from '../@types/discord'
import voiceStateLog from '../functions/voiceStateLog'
import { handleLobbyJoin, handlePrivateChannelTimeout } from '../functions/usePrivateChannel'

const event: BotEvent = {
  name: 'voiceStateUpdate',
  once: false,
  execute: (oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
    voiceStateLog(oldVoiceState, newVoiceState)
    handleLobbyJoin(newVoiceState)
    handlePrivateChannelTimeout(oldVoiceState, newVoiceState)
  },
}

export default event
