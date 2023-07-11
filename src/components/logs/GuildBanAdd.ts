import { EmbedBuilder, GuildBan } from 'discord.js'
import validateLog from '../../functions/validateLog'
import { t } from 'i18next'

const GuildBanAddLog = async (guildBan: GuildBan) => {
  const channel = await validateLog(guildBan.guild, 'guildBanAdd')
  if (!channel) return

  const embed = new EmbedBuilder()
    .setAuthor({
      name: t('logs:guildBanAdd_author', { lng: guildBan.guild.preferredLocale, user: guildBan.user.username }),
      iconURL: guildBan.user.displayAvatarURL(),
    })
    .setDescription(`${guildBan.user} (${guildBan.user.username})`)
    .setFooter({ text: `ID: ${guildBan.user.id}` })
    .setColor('Red')
    .setTimestamp()

  channel.send({ embeds: [embed] })
}

export default GuildBanAddLog
