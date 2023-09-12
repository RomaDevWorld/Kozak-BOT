import { ChannelType, SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'

const cmd = new SlashCommandSubcommandBuilder()
  .setName('ignored-channels')
  .setDescription('Specify up to 10 ignored channels')
  .setDescriptionLocalizations({ uk: 'Вкажіть до 10 каналів, де не буде видаватись досвід' })

for (let i = 0; i < 10; i++) {
  cmd.addChannelOption((option) =>
    option
      .setName(`channel-${i}`)
      .setDescriptionLocalizations({ uk: `Канал ${i + 1}` })
      .setDescription('Channel to ignore')
      .addChannelTypes(
        ChannelType.GuildText,
        ChannelType.GuildVoice,
        ChannelType.GuildForum,
        ChannelType.GuildAnnouncement,
        ChannelType.GuildStageVoice
      )
  )
}

const LevelingIgnoredChannelsSubcommand: SubCommand = {
  data: cmd,
  execute: async (interaction) => {
    const lng = interaction.locale

    const channels: string[] = []
    for (let i = 0; i <= 10; i++) {
      const option = interaction.options.getChannel(`channel-${i}`)
      if (option && !channels.includes(option.id)) channels.push(option.id)
    }

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'leveling.ignoredChannels': channels }, { upsert: true })

    interaction.reply({
      content: t('config:xp.ignoredChannels.success', { lng, channels: channels.map((i) => `<#${i}>`).join(`\n`) }),
      ephemeral: true,
    })
  },
}

export default LevelingIgnoredChannelsSubcommand
