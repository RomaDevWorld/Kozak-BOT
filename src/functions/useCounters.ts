import { Client, GuildMember } from 'discord.js'
import Modules from '../schemas/Modules'
import { fetchAllMembers, getBots, getHumans, getOnline, getVoices } from './fetchMembers'

const useCounters = (client: Client) => {
  setInterval(async () => {
    const data = await Modules.find()

    data.forEach(async (item) => {
      if (!item.counter?.channelId || !item.counter.label) return

      const guild = client.guilds.cache.get(item.guildId)
      if (!guild) return

      const channel = guild.channels.cache.get(item.counter.channelId)
      if (!channel || !channel.permissionsFor(guild.members.me as GuildMember).has('ManageChannels')) return

      try {
        const members = await fetchAllMembers(guild)

        if (!members) return

        const online = getOnline(members, ['online', 'idle', 'dnd'])
        const humans = getHumans(members)

        if (!online || !members) return

        const name = item.counter.label
          .replaceAll(`ON`, online.toString())
          .replaceAll(`MEM`, humans.toString())
          .replaceAll(`ALL`, humans.toString())
          .replaceAll('BOT', getBots(members).toString())
          .replaceAll('VC', getVoices(members).toString())

        if (channel.name !== name)
          channel.setName(name.slice(0, 100)).catch((err) => console.error(`Can't update ${channel.id} name: ${err.message}`))
      } catch (error) {
        console.error(error)
      }
    })
  }, 60000 / 2)
}

export default useCounters
