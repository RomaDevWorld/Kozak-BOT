import { ButtonBuilder, Client } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'
import { Button } from '../../types'

module.exports = (client: Client) => {
  const buttons: ButtonBuilder[] = []

  const buttonsDir = join(__dirname, '../components/buttons')

  readdirSync(buttonsDir).forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const button: Button = require(`${buttonsDir}/${file}`).default
    buttons.push(button.button)
    client.buttons.set(button.button.data.custom_id, button)
  })
}
