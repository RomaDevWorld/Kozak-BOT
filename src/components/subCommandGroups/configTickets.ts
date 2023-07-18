import { SlashCommandSubcommandGroupBuilder } from 'discord.js'
import { SubCommandGroup } from '../../@types/discord'
import CreateTicketSubcommand from '../subCommands/createTicket'

const TicketsSubCommandGroup: SubCommandGroup = {
  data: new SlashCommandSubcommandGroupBuilder()
    .setName('tickets')
    .setDescription('Configure tickets')
    .setDescriptionLocalizations({ uk: 'Налаштувати квитки' })
    .addSubcommand(CreateTicketSubcommand.data),
  execute: async function (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'create': {
        return CreateTicketSubcommand.execute(interaction)
      }
    }
  },
}

export default TicketsSubCommandGroup
