import { Guild, PresenceStatus } from 'discord.js'

export const getOnline = async (guild: Guild, status?: PresenceStatus[]) => {
  if (!status) status = ['online']

  const members = await guild.members.fetch()
  return members.filter((mem) => !status?.includes(mem.presence?.status as PresenceStatus) && !mem.user.bot).size
}
export const getHumans = async (guild: Guild) => {
  const members = await guild.members.fetch()
  return members.filter((mem) => !mem.user.bot).size
}
export const getBots = async (guild: Guild) => {
  const members = await guild.members.fetch()
  return members.filter((mem) => mem.user.bot).size
}
export const getVoices = async (guild: Guild) => {
  const members = await guild.members.fetch()
  return members.filter((mem) => mem.voice.channel && !mem.user.bot).size
}
