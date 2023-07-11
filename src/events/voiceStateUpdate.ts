import { VoiceState } from 'discord.js'
import { BotEvent } from '../@types/discord'
import voiceStateLog from '../functions/voiceStateLog'

const event: BotEvent = {
  name: 'voiceStateUpdate',
  once: false,
  execute: (oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
    voiceStateLog(oldVoiceState, newVoiceState)
  },
}

export default event
