import { Interaction } from 'discord.js'
import { BotEvent } from '../../types'

const event: BotEvent = {
  name: 'interactionCreate',
  execute: (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      // Handle slash commands

      const command = interaction.client.slashCommands.get(interaction.commandName)
      const cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`)
      if (!command) return
      if (command.cooldown && cooldown) {
        if (Date.now() < cooldown) {
          interaction.reply({ content: `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`, ephemeral: true })
          setTimeout(() => interaction.deleteReply(), 5000)
          return
        }
        interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
        setTimeout(() => {
          interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`)
        }, command.cooldown * 1000)
      } else if (command.cooldown && !cooldown) {
        interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
      }
      command.execute(interaction)
    } else if (interaction.isAutocomplete()) {
      // Handle autocomplete

      const command = interaction.client.slashCommands.get(interaction.commandName)
      if (!command) return console.error(`No slash command matching ${interaction.commandName} was found.`)
      try {
        if (!command.autocomplete) return
        command.autocomplete(interaction)
      } catch (error) {
        console.error(error)
      }
    } else if (interaction.isButton()) {
      // Handle buttons

      const button = interaction.client.buttons.get(interaction.customId)
      if (!button) return console.error(`No button matching ${interaction.customId} was found.`)
      button.execute(interaction)
    } else if (interaction.isContextMenuCommand()) {
      // Handle context menu commands

      const command = interaction.client.contextCommands.get(interaction.commandName)
      if (!command) return console.error(`No context command matching ${interaction.commandName} was found.`)
      command.execute(interaction)
    }
  },
}

export default event
