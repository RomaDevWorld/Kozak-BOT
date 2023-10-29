import { EmbedBuilder, Message } from 'discord.js'
import XPs from '../schemas/XPs'
import getRandomNum from './getRandomNum'
import Modules from '../schemas/Modules'
import { t } from 'i18next'
import ModulesRanking from '../schemas/Modules.Ranking'

const cd = new Set<string>()

export const addXp = async (message: Message) => {
  if (!message.member || !message.guild || message.author.bot || cd.has(message.author.id)) return

  const data = await Modules.findOne({ guildId: message.guild.id })
  if (
    !data ||
    !data.leveling?.status ||
    data.leveling.ignoredChannels.includes(message.channel.id) ||
    data.leveling.ignoredRoles.some((role) => message.member?.roles.cache.get(role))
  )
    return (
      cd.add(message.author.id),
      setTimeout(() => {
        cd.delete(message.author.id)
      }, 2000)
    )

  cd.add(message.author.id)

  if (!data.leveling.cooldown || data.leveling.cooldown < 15000 || data.leveling.cooldown > 300000) data.leveling.cooldown = 15000

  setTimeout(() => {
    cd.delete(message.author.id)
  }, data.leveling.cooldown)

  if (!data.leveling.minXp || data.leveling.minXp < 1 || data.leveling.minXp > 10000) data.leveling.minXp = 1
  if (!data.leveling.maxXp || data.leveling.maxXp < 1 || data.leveling.maxXp > 20000) data.leveling.maxXp = 15

  const xpToGive = getRandomNum(data.leveling.minXp, data.leveling.maxXp)

  const updated = await XPs.findOneAndUpdate(
    { memberId: message.author.id, guildId: message.guild.id },
    { $inc: { xp: xpToGive } },
    { upsert: true, new: true }
  )

  const curLvl = getLevel(updated.xp - xpToGive).level
  const newLvl = getLevel(updated.xp).level

  if (data.leveling?.notifications?.onLvlUp && newLvl > curLvl) {
    const lng = message.guild.preferredLocale

    const embed = new EmbedBuilder()
      .setDescription(t('xp.notifications.lvlUp.description', { lng: lng, xp: updated.xp, level: newLvl }))
      .setColor('Blue')

    const msg = await message.reply({ embeds: [embed] }).catch((err) => console.error(`Error while replying: ${err.message}`))

    setTimeout(() => {
      if (msg) msg.delete().catch((err) => err)
    }, 5000)

    const ranks = await ModulesRanking.find({ guildId: message.guild.id, lvl: { $lte: newLvl } })
    ranks.forEach((r) => {
      const role = message.guild?.roles.cache.get(r.roleId)
      if (role) message.member?.roles.add(role).catch((err: Error) => console.error(`Unable to give ranked role: ${err.message}`))
    })
  }
}

export const getLevel = (xp: number) => {
  let level = 0
  let reqXp = 100

  while (xp >= reqXp) {
    xp -= reqXp
    level++
    reqXp *= 1.2
  }

  return {
    level,
    xpToNextLvl: Math.floor(reqXp - xp),
  }
}
