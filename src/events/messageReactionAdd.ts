import { MessageReaction, User } from 'discord.js'
import { BotEvent } from '../@types/discord'
import reactionAutoBan from '../functions/reactionAutoBan'
import { handleStarReaction } from '../functions/useStarboard'

const event: BotEvent = {
  name: 'messageReactionAdd',
  once: false,
  execute: (messageReaction: MessageReaction, user: User) => {
    reactionAutoBan(messageReaction, user)
    handleStarReaction(messageReaction, user)
  },
}

export default event
