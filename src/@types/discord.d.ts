/* eslint-disable no-unused-vars */
import {
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from 'discord.js'

export interface BotEvent {
  name: string
  once?: boolean | false
  execute: (...args) => void
}

export interface SlashCommand {
  command: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
  autocomplete?: (interaction: AutocompleteInteraction) => void
  cooldown?: number
}

export interface Button {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  button: ButtonBuilder | any // For some reason "ButtonBuilder" does not provide "custom_id"
  execute: (interaction: ButtonInteraction) => void
}

export interface ContextMenuCommand {
  command: ContextMenuCommandBuilder
  execute: (interaction: ContextMenuCommandInteraction) => void
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    buttons: Collection<string, Button>
    cooldowns: Collection<string, number>
    contextCommands: Collection<string, ContextMenuCommand>
  }
}
