export interface BotEvent {
  name: string
  once?: boolean | false
  execute: (...args) => void
}

export interface SubCommandGroup {
  data: SlashCommandSubcommandGroupBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
}
export interface SubCommand {
  data: SlashCommandSubcommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
}

export interface SlashCommand {
  command: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
  autocomplete?: (interaction: AutocompleteInteraction) => void
  install?: {
    integration_types: (0 | 1)[],
    contexts: (0 | 1 | 2)[]
  }
  cooldown?: number
}

export interface Button {
  button: any
  execute: (interaction: ButtonInteraction) => void
}

export interface ContextMenuCommand {
  command: ContextMenuCommandBuilder
  install?: {
    integration_types: (0 | 1)[],
    contexts: (0 | 1 | 2)[]
  }
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
