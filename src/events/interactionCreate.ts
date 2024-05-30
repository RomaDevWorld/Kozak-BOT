import { Interaction } from 'discord.js'
import { t } from 'i18next'
import { BotEvent, Button } from '../@types/discord'

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
          interaction
            .reply({
              content: t('cooldown', { count: Math.floor(Math.abs(Date.now() - cooldown) / 1000), lng: interaction.locale }),
              ephemeral: true,
            })
            .catch((err) => console.error(err))
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

      const allButtons: Button[] = Array.from(interaction.client.buttons.values())

      for (const i in allButtons) {
        if (interaction.customId.startsWith(allButtons[i].button.data.custom_id)) return allButtons[i].execute(interaction)
      }
    } else if (interaction.isContextMenuCommand()) {
      // Handle context menu commands

      const command = interaction.client.contextCommands.get(interaction.commandName)
      if (!command) return console.error(`No context command matching ${interaction.commandName} was found.`)
      command.execute(interaction)
    }
  },
}

export default event
