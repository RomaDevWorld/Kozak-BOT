import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js'
import { Button } from '../../@types/discord'
import Modules from '../../schemas/Modules'

const LogTypeSwitch: Button = {
  button: new ButtonBuilder().setCustomId('switch_'),
  execute: async (interaction) => {
    const data = await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { guildId: interaction.guildId }, { new: true, upsert: true })
    const types = data.log?.types
    const clicked = interaction.customId.split('_')[1]
    const active = interaction.component.style === ButtonStyle.Success ? true : false
    const guildId = interaction.guildId

    switch (clicked) {
      case 'messages': {
        await Modules.updateOne({ guildId }, { $set: { 'log.types': { messageDelete: !active, messageUpdate: !active } } }, { upsert: true })
        flipButtonStyle(interaction)
        break
      }
      case 'members': {
        await Modules.updateOne({ guildId }, { $set: { 'log.types': { guildMemberAdd: !active, guildMemberRemove: !active } } }, { upsert: true })
        flipButtonStyle(interaction)
        break
      }
      case 'voices': {
        await Modules.updateOne({ guildId }, { $set: { 'log.types': { voiceStateUpdate: !active } } }, { upsert: true })
        flipButtonStyle(interaction)
        break
      }
      case 'mods': {
        await Modules.updateOne(
          { guildId },
          {
            $set: {
              'log.types': {
                guildMemberTimeout: !active,
                guildBanAdd: !active,
                guildBanRemove: !active,
                guildMemberNicknameUpdate: !active,
                guildMemberRolesUpdate: !active,
              },
            },
          },
          { upsert: true }
        )

        flipButtonStyle(interaction)
        break
      }
      case 'reports': {
        await Modules.updateOne({ guildId }, { $set: { 'log.types': { guildMemberReport: !active } } }, { upsert: true })
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
