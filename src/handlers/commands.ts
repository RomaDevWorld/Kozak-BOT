import { Client, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import { readdirSync } from 'fs'
import { join } from 'path'
import { SlashCommand, ContextMenuCommand } from '../@types/discord'

import { config } from 'dotenv'
config()

module.exports = (client: Client) => {
  const commands: any[] = [] // Will use any for now

  const commandsDir = join(__dirname, '../commands')
  const contextDir = join(__dirname, '../components/context')

  readdirSync(commandsDir).forEach((file) => {
    const command: SlashCommand = require(`${commandsDir}/${file}`).default
    commands.push({...command.command.toJSON(), ...command.install})
    client.slashCommands.set(command.command.name, command)
  })

  readdirSync(contextDir).forEach((file) => {
    const command: ContextMenuCommand = require(`${contextDir}/${file}`).default
    commands.push({...command.command.toJSON(), ...command.install})
    client.contextCommands.set(command.command.name, command)
  })

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string)

  rest
    .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string), {
      body: commands,
    })
    .then((data: any) => {
      console.log(`[Commands] Successfully loaded ${data.length} commands`)
    })
    .catch((e) => {
      console.error(e)
    })
}
