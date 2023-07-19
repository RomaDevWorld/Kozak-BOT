import { Client, GuildMember } from 'discord.js'
import Modules from '../schemas/Modules'
import { getBots, getHumans, getOnline, getVoices } from './fetchMembers'

const useCounters = (client: Client) => {
  setInterval(async () => {
    const data = await Modules.find()

    data.forEach(async (element) => {
      if (!element.counter.channelId || !element.counter.label) return

      const guild = client.guilds.cache.get(element.guildId)
      if (!guild) return

      const channel = guild.channels.cache.get(element.counter.channelId)
      if (!channel || !channel.permissionsFor(guild.members.me as GuildMember).has('ManageChannels')) return

      try {
        const online = await getOnline(guild, ['online', 'idle', 'dnd'])
        const members = await getHumans(guild)

        const name = element.counter.label
          .replaceAll(`ON`, online.toString())
          .replaceAll(`MEM`, members.toString())
          .replaceAll(`ALL`, members.toString())
          .replaceAll('BOT', await getBots(guild).toString())
          .replaceAll('VC', await getVoices(guild).toString())

        if (channel.name !== name) channel.setName(name).catch((err) => console.error(`Can't update ${channel.id} name: ${err.message}`))
      } catch (error) {
        console.error(error)
      }
    })
  }, 60000 * 0.25)
}

export default useCounters
