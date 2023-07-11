import { Message, TextChannel } from 'discord.js'

const followUps = new Map<string, { message: Message; createdTimestamp: number }>()

export const saveFollowUp = (voiceStateId: string, message: Message) => {
  followUps.set(voiceStateId, { message, createdTimestamp: Date.now() })
}

export const getFollowUp = async (voiceStateId: string, channel: TextChannel) => {
  const followUp = followUps.get(voiceStateId)
  if (!followUp) return

  try {
    const message = await channel.messages.fetch(followUp.message.id)
    if (!message) return

    return message
  } catch (error) {
    return
  }
}

export const removeFollowUp = (voiceStateId: string) => {
  followUps.delete(voiceStateId)
}
