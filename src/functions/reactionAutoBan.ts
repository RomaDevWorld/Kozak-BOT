import { MessageReaction, User } from 'discord.js'
import client from '../lib/client'

const reactionAutoBan = async (messageReaction: MessageReaction, user: User) => {
  if (!messageReaction || messageReaction.emoji.name !== '🇷🇺') return

  try {
    const guild = await client.guilds.fetch(messageReaction.message.guildId as string)
    if (!guild) return

    const member = await guild.members.fetch(user.id)
    if (!member) return

    messageReaction.remove().catch((err) => console.error(`Can't remove reaction: ${err.message}`))
    messageReaction.message.react('🇺🇦').catch((err) => console.error(`Can't add reaction: ${err.message}`))

    if (member.bannable)
      member.ban({ reason: 'Russia is a terrorist state' }).catch((err) => console.error(`Can't ban reaction author: ${err.message}`))
  } catch (err) {
    if (err) console.error(err)
  }
}

export default reactionAutoBan
