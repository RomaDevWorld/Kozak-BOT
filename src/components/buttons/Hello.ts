import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { Button } from '../../../types'

const button: Button = {
  button: new ButtonBuilder().setCustomId('hello').setLabel('Hello').setStyle(ButtonStyle.Secondary),
  execute: (interaction) => {
    interaction.reply({ content: `Pong! ${interaction.client.ws.ping}`, ephemeral: true })
  },
}

export default button
