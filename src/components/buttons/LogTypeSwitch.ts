import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js'
import { Button } from '../../@types/discord'
import Modules from '../../schemas/Modules'

const LogTypeSwitch: Button = {
  button: new ButtonBuilder().setCustomId('switch_'),
  execute: async (interaction) => {
    const clicked = interaction.customId.split('_')[1]
    const active = interaction.component.style === ButtonStyle.Success ? true : false
    const guildId = interaction.guildId

    const data = await Modules.findOneAndUpdate({ guildId }, {}, { new: true, upsert: true })
    const types = data.log?.types

    switch (clicked) {
      case 'messages': {
        if (types) {
          types.messageUpdate = !active
          types.messageDelete = !active
          data.save()
        }

        flipButtonStyle(interaction)
        break
      }
      case 'members': {
        if (types) {
          types.guildMemberAdd = !active
          types.guildMemberRemove = !active
          data.save()
        }
        flipButtonStyle(interaction)
        break
      }
      case 'voices': {
        if (types) {
          types.voiceStateUpdate = !active
          data.save()
        }
        flipButtonStyle(interaction)
        break
      }
      case 'mods': {
        if (types) {
          types.guildMemberTimeout = !active
          types.guildBanAdd = !active
          types.guildBanRemove = !active
          types.guildMemberNicknameUpdate = !active
          types.guildMemberRolesUpdate = !active
          data.save()
        }

        flipButtonStyle(interaction)
        break
      }
      case 'reports': {
        if (types) {
          types.guildMemberReport = !active
          data.save()
        }
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
