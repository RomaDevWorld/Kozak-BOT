import { ChannelType, EmbedBuilder, ImageURLOptions, MessageReaction, User, parseEmoji } from 'discord.js'
import Modules from '../schemas/Modules'
import StarboardMessages from '../schemas/StarboardMessages'

export const handleStarReaction = async (reaction: MessageReaction, user: User) => {
  if (!reaction || !user || reaction.message.author?.bot || user.bot) return

  const guild = reaction.message.guild
  if (!guild) return
  const count = reaction.users.cache.filter((user) => !user.bot).size
  if (count < 3) return

  const data = await Modules.findOne({ guildId: guild.id })
  if (!data || !data?.starboard) return

  if (!data.starboard.threshold || data.starboard.threshold < 3) data.starboard.threshold = 3

  if (!data?.starboard.status || count < data.starboard.threshold) return
  if (reaction.emoji.name !== data.starboard.emoji && reaction.emoji.id !== parseEmoji(data.starboard.emoji)?.id) return

  const channel = guild.channels.cache.get(data.starboard.channelId)
  if (!channel || channel.type !== ChannelType.GuildText) return

  const exist = await StarboardMessages.findOne({ messageId: reaction.message.id })
  if (exist?.count === count) return
  if (exist) {
    const message = await channel.messages.fetch(exist.starboardMessageId).catch((e) => e)

    if (!message) return
    message.edit({ content: `**${reaction.emoji.toString()} ${count}**` })

    await StarboardMessages.findOneAndUpdate({ messageId: reaction.message.id }, { count }, { upsert: true })

    return
  }

  const embed = new EmbedBuilder()
    .setColor('Yellow')
    .setTimestamp()
    .setDescription(`${reaction.message.content?.slice(0, 4000)}\n\n${reaction.message.url}`)
    .setAuthor({
      name: reaction.message.author?.username || 'N/A',
      iconURL: reaction.message.author?.avatarURL({ dynamic: true } as ImageURLOptions) || undefined,
    })
  if (reaction.message.attachments.size > 0) embed.setImage(reaction.message.attachments.first()?.url || null)

  const starboardMessage = await channel.send({ content: `**${reaction.emoji.toString()} ${count}**`, embeds: [embed] }).catch((e) => e)

  await StarboardMessages.findOneAndUpdate({ messageId: reaction.message.id }, { starboardMessageId: starboardMessage.id, count }, { upsert: true })
}
