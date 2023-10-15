import { SlashCommandSubcommandBuilder } from 'discord.js'
import { SubCommand } from '../../@types/discord'
import { t } from 'i18next'
import Modules from '../../schemas/Modules'

const StarboardEmojiSubcommand: SubCommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('emoji')
    .setDescription('Set emoji')
    .addStringOption((option) => option.setName('emoji').setDescription('Emoji').setRequired(true))
    .setDescriptionLocalizations({ uk: 'Увімкнути або вимкнути цей модуль' }),
  execute: async function (interaction) {
    const lng = interaction.locale
    const emoji = interaction.options.getString('emoji') as string

    await Modules.findOneAndUpdate({ guildId: interaction.guildId }, { 'starboard.emoji': emoji }, { upsert: true })

    interaction.reply({ content: t('config:starboard.emoji.success', { lng, emoji: emoji.toString() }), ephemeral: true })
  },
}

export default StarboardEmojiSubcommand
