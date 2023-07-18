import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { Button } from '../../@types/discord'

const TicketButton: Button = {
  button: new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('ticket'),
  execute: async (interaction) => {
    interaction.message.id
  },
}
export default TicketButton
