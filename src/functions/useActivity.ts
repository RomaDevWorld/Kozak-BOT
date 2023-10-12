import { Client } from 'discord.js'

const useActivity = (client: Client) => {
  if (!process.env.ACTIVITY_NAME) return

  setInterval(() => {
    client.user?.setActivity(process.env.ACTIVITY_NAME as string)
  }, 60000)
}

export default useActivity
