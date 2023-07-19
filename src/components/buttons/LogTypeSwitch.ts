import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js'
import { Button } from '../../@types/discord'
import Modules from '../../schemas/Modules'

const LogTypeSwitch: Button = {
  button: new ButtonBuilder().setCustomId('switch_'),
  execute: async (interaction) => {
    const data = await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { guildId: interaction.guildId }, { new: true, upsert: true })
    const types = data.log.types
    const clicked = interaction.customId.split('_')[1]
    const active = interaction.component.style === ButtonStyle.Success ? true : false

    switch (clicked) {
      case 'messages': {
        types['messageDelete'] = !active
        types['messageUpdate'] = !active
        data.save()
        flipButtonStyle(interaction)
        break
      }
      case 'members': {
        types['guildMemberAdd'] = !active
        types['guildMemberRemove'] = !active
        data.save()
        flipButtonStyle(interaction)
        break
      }
      case 'voices': {
        types['voiceStateUpdate'] = !active
        data.save()
        flipButtonStyle(interaction)
        break
      }
      case 'mods': {
        types['guildMemberTimeout'] = !active
        types['guildBanAdd'] = !active
        types['guildBanRemove'] = !active
        types['guildMemberNicknameUpdate'] = !active
        types['guildMemberRolesUpdate'] = !active

        data.save()
        flipButtonStyle(interaction)
        break
      }
      case 'reports': {
        types['guildMemberReport'] = !active
        data.save()
        flipButtonStyle(interaction)
        break
      }
    }
  },
}

export default LogTypeSwitch

const flipButtonStyle = (interaction: ButtonInteraction) => {
  const row = new ActionRowBuilder<ButtonBuilder>()

  interaction.message.components[0].components.forEach((component) => {
    if (component.type !== ComponentType.Button) return

    const updatedButton = new ButtonBuilder(component.data)
    if (component.customId === interaction.customId)
      updatedButton.setStyle(component.style === ButtonStyle.Success ? ButtonStyle.Danger : ButtonStyle.Success)

    row.addComponents(updatedButton)
  })

  interaction.update({ components: [row] })
}
