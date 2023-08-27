import { Message } from 'discord.js'
import XPs from '../schemas/XPs'
import getRandomNum from './getRandomNum'
import Modules from '../schemas/Modules'

const cd = new Set<string>()

export const addXp = async (message: Message) => {
  if (!message.member || !message.guild || message.author.bot || cd.has(message.author.id)) return

  const data = await Modules.findOne({ guildId: message.guild.id })
  if (!data || !data.leveling?.status) return

  cd.add(message.author.id)
  setTimeout(() => {
    cd.delete(message.author.id)
  }, data.leveling?.cooldown || 15000)

  await XPs.findOneAndUpdate(
    { memberId: message.author.id, guildId: message.guild.id },
    { $inc: { xp: getRandomNum(data.leveling?.minXp || 5, data.leveling?.maxXp || 15) } },
    { upsert: true }
  )
}
