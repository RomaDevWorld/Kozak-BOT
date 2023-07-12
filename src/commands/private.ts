import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../@types/discord'
import ManagePrivateSubcommandGroup from '../components/subCommandGroups/privateManage'
import InvitePrivateSubcommand from '../components/subCommands/privateInvite'
import KickPrivateSubcommand from '../components/subCommands/privateKick'
import CreatePrivateSubcommand from '../components/subCommands/privateCreate'

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('private')
    .addSubcommandGroup(ManagePrivateSubcommandGroup.data)
    .addSubcommand(InvitePrivateSubcommand.data)
    .addSubcommand(KickPrivateSubcommand.data)
    .addSubcommand(CreatePrivateSubcommand.data)
    .setDescription('Create and manage your own private voice channel')
    .setDescriptionLocalizations({
      uk: 'Створення та керування Вашим особистим голосовим каналом',
    }),

  cooldown: 10,
  execute: async (interaction) => {
    switch (interaction.options.getSubcommandGroup()) {
      case 'manage':
        ManagePrivateSubcommandGroup.execute(interaction)
        break
      default: {
        switch (interaction.options.getSubcommand()) {
          case 'invite':
            InvitePrivateSubcommand.execute(interaction)
            break
          case 'kick':
            KickPrivateSubcommand.execute(interaction)
            break
          case 'create':
            CreatePrivateSubcommand.execute(interaction)
            break
        }
      }
    }
  },
}

export default command
