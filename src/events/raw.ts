import { TextChannel } from 'discord.js'
import { BotEvent } from '../@types/discord'
import client from '../lib/client'

interface RawEventData {
  t: string
  d: {
    user_id: string
    channel_id: string
    message_id: string
    emoji: {
      id: string | null
      name: string
    }
  }
}

const event: BotEvent = {
  name: 'raw',
  once: false,
  execute: async (event: RawEventData) => {
    const events = {
      MESSAGE_REACTION_ADD: 'messageReactionAdd',
      MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
    }

    if (!(event.t in events)) return

    const { d: data } = event
    const user = client.users.cache.get(data.user_id)
    const channel = client.channels.cache.get(data.channel_id) as TextChannel | undefined
    if (!channel) return

    if (channel.messages.cache.has(data.message_id)) return

    const message = await channel.messages.fetch(data.message_id)

    const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name
    const reaction = message.reactions.cache.get(emojiKey)

    client.emit(events[event.t as keyof typeof events], reaction, user)
  },
}

export default event
