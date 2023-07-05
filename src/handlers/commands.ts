import { Client, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import { readdirSync } from 'fs'
import { join } from 'path'
import { SlashCommand, ContextMenuCommand } from '../@types/discord'

import { config } from 'dotenv'
config()

module.exports = (client: Client) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commands: any[] = [] // Will use any for now

  const commandsDir = join(__dirname, '../commands')
  const contextDir = join(__dirname, '../components/context')

  readdirSync(commandsDir).forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command: SlashCommand = require(`${commandsDir}/${file}`).default
    commands.push(command.command)
    client.slashCommands.set(command.command.name, command)
  })

  readdirSync(contextDir).forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command: ContextMenuCommand = require(`${contextDir}/${file}`).default
    commands.push(command.command)
    client.contextCommands.set(command.command.name, command)
  })

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string)

  rest
    .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), {
      body: commands.map((command) => command.toJSON()),
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((data: any) => {
      console.log(`[Commands] Successfully loaded ${data.length} commands`)
    })
    .catch((e) => {
      console.error(e)
    })
}
