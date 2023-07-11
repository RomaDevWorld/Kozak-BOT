import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import { SlashCommand, Button, ContextMenuCommand } from '../@types/discord'
config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
})

client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>()
client.buttons = new Collection<string, Button>()
client.contextCommands = new Collection<string, ContextMenuCommand>()

client.login(process.env.TOKEN)

export default client
