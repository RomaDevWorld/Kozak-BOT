import { Client } from 'discord.js'
import { BotEvent } from '../@types/discord'
import useCounters from '../functions/useCounters'
import { cacheAllInvites } from '../functions/trackInvites'
import cleanUp from '../functions/cleanUp'
import useActivity from '../functions/useActivity'

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: (client: Client) => {
    // eslint-disable-next-line no-console
    console.log(`[Discord Ready] Logged in as ${client.user?.tag}`)

    cleanUp(client)

    useCounters(client)
    cacheAllInvites(client)

    useActivity(client)
  },
}

export default event
