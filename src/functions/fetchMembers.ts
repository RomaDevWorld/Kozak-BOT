import { Collection, Guild, GuildMember, PresenceStatus } from 'discord.js'

export const fetchAllMembers = async (guild: Guild) => {
  return await guild.members.fetch().catch((err) => console.error(`Error while fetching members: ${err}`))
}

export const getOnline = (members: Collection<string, GuildMember>, status?: PresenceStatus[]) => {
  if (!status) status = ['online']

  return members.filter((mem) => status?.includes(mem.presence?.status as PresenceStatus) && !mem.user.bot).size
}
export const getHumans = (members: Collection<string, GuildMember>) => {
  return members.filter((mem) => !mem.user.bot).size
}
export const getBots = (members: Collection<string, GuildMember>) => {
  return members.filter((mem) => mem.user.bot).size
}
export const getVoices = (members: Collection<string, GuildMember>) => {
  return members.filter((mem) => mem.voice.channel && !mem.user.bot).size
}
