import { ActivityType, Client } from 'discord.js'

const useActivity = (client: Client) => {
  if (!process.env.ACTIVITY_NAME) return

  setInterval(() => {
    client.user?.setActivity({ name: 'customstatus', type: ActivityType.Custom, state: process.env.ACTIVITY_NAME })
  }, 600000)
}

export default useActivity
