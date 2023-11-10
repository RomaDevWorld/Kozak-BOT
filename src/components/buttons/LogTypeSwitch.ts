import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js'
import { Button } from '../../@types/discord'
import Modules from '../../schemas/Modules'

const LogTypeSwitch: Button = {
  button: new ButtonBuilder().setCustomId('switch_'),
  execute: async (interaction) => {
    const clicked = interaction.customId.split('_')[1]
    const active = interaction.component.style === ButtonStyle.Success ? true : false
    const guildId = interaction.guildId

    const data = await Modules.findOneAndUpdate({ guildId }, { guildId }, { new: true, upsert: true })
    const types = data.log?.types

    switch (clicked) {
      case 'messages': {
        await Modules.findOneAndUpdate({ guildId }, { 'log.types.messageDelete': !active, 'log.types.messageUpdate': !active }, { upsert: true })

        flipButtonStyle(interaction)
        break
      }
      case 'members': {
        await Modules.findOneAndUpdate({ guildId }, { 'log.types.guildMemberAdd': !active, 'log.types.guildMemberRemove': !active }, { upsert: true })

        flipButtonStyle(interaction)
        break
      }
      case 'voices': {
        await Modules.findOneAndUpdate({ guildId }, { 'log.types.voiceStateUpdate': !active }, { upsert: true })

        flipButtonStyle(interaction)
        break
      }
      case 'mods': {
        await Modules.findOneAndUpdate(
          { guildId },
          {
            'log.types.guildMemberTimeout': !active,
            'log.types.guildBanAdd': !active,
            'log.types.guildBanRemove': !active,
            'log.types.guildMemberNicknameUpdate': !active,
            'log.types.guildMemberRolesUpdate': !active,
            'log.types.guildMemberWarn': !active,
          },
          { upsert: true }
        )

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
