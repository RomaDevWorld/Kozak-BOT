import { Message } from 'discord.js'
import XPs from '../schemas/XPs'
import getRandomNum from './getRandomNum'

const cd = new Set<string>()

export const addXp = async (message: Message) => {
  if (!message.member || !message.guild || message.author.bot || cd.has(message.author.id)) return

  cd.add(message.author.id)
  setTimeout(() => {
    cd.delete(message.author.id)
  }, 15000)

  await XPs.findOneAndUpdate({ memberId: message.member.id, guildId: message.guild.id }, { $inc: { xp: getRandomNum(1, 5) } }, { upsert: true })
}
