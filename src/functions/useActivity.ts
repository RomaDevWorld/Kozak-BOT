import { Client } from 'discord.js'

const useActivity = (client: Client) => {
  if (!process.env.ACTIVITY_NAME) return

  setInterval(() => {
    client.user?.setActivity({ name: process.env.ACTIVITY_NAME })
  }, 60000)
}

export default useActivity
