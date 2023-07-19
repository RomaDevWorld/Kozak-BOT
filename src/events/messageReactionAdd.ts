import { MessageReaction, User } from 'discord.js'
import { BotEvent } from '../@types/discord'
import reactionAutoBan from '../functions/reactionAutoBan'

const event: BotEvent = {
  name: 'messageReactionAdd',
  once: false,
  execute: (messageReaction: MessageReaction, user: User) => {
    reactionAutoBan(messageReaction, user)
  },
}

export default event
