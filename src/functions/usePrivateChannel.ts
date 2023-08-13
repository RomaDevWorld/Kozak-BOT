import { ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, GuildMember, PermissionFlagsBits, VoiceChannel, VoiceState } from 'discord.js'
import Modules from '../schemas/Modules'
import RestorePrivates from '../schemas/RestorePrivate'
import RestorePrivate from '../components/buttons/RestorePrivate'
import { t } from 'i18next'

export const handleLobbyJoin = async (newVoiceState: VoiceState) => {
  if (!newVoiceState.channel || !newVoiceState.member || newVoiceState.member.user.bot) return

  const data = await Modules.findOne({ guildId: newVoiceState.channel?.guild.id })
  if (!data || data.lobby?.channel !== newVoiceState.channel?.id) return

  const lobbyChannel = newVoiceState.guild.channels.cache.get(data.lobby.channel) as VoiceChannel

  const existingChannel = getPrivateChannel(newVoiceState.member)
  if (existingChannel) return newVoiceState.member.voice.setChannel(existingChannel).catch((err) => console.error(err))

  createPrivateChannel(newVoiceState.member, lobbyChannel)
}

export const createPrivateChannel = async (member: GuildMember, lobbyChannel: VoiceChannel) => {
  if (!member.guild?.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return

  const channel = await member.guild.channels
    .create({
      name: `${member.nickname || member.user.username}`,
      bitrate: 96000,
      parent: lobbyChannel.parent,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        { id: member.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Speak] },
      ],
    })
    .catch((err) => console.error(err))
  if (!channel) return

  if (member.voice.channel) member.voice.setChannel(channel as VoiceChannel).catch((err) => console.error(err))

  savePrivateChannel(member, channel)

  const data = await RestorePrivates.findOne({ guildId: member.guild.id, memberId: member.id })
  if (data && (data.name || data.limit || data.isPublic || data.invited?.length || data.kicked?.length)) {
    const lng = member.guild.preferredLocale

    const embed = new EmbedBuilder()
      .setAuthor({ name: t('privates:restore.embed_title', { lng }) })
      .setColor('Green')
      .setFooter({ text: t('privates:restore.embed_footer', { lng }) })
    if (data.name) embed.addFields({ name: t('privates:restore.name', { lng }), value: data.name })
    if (data.limit) embed.addFields({ name: t('privates:restore.limit', { lng }), value: data.limit.toString() })
    if (data.isPublic) embed.addFields({ name: t('privates:restore.isPublic', { lng }), value: data.isPublic ? t('yes', { lng }) : t('no', { lng }) })
    if (data.invited?.length)
      embed.addFields({ name: t('privates:restore.invited', { lng }), value: data.invited.map((id) => `<@${id}>`).join(', ') })
    if (data.kicked?.length) embed.addFields({ name: t('privates:restore.kicked', { lng }), value: data.kicked.map((id) => `<@${id}>`).join(', ') })

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder(RestorePrivate.button.data).setLabel(t('privates:restore.buttonText', { lng }))
    )
    channel.send({ content: `<@${member.id}>`, components: [row], embeds: [embed] })
  }

  return channel
}

const privateChannels = new Map<string, { channel: VoiceChannel }>()

export const savePrivateChannel = (member: GuildMember, channel: VoiceChannel) => {
  privateChannels.set(member.id, { channel })
}

export const getPrivateChannel = (member: GuildMember) => {
  const value = privateChannels.get(member.id)

  if (!value) return

  return member.guild.channels.cache.get(value.channel.id) as VoiceChannel
}

export const removePrivateChannel = async (member: GuildMember) => {
  const existingChannel = getPrivateChannel(member)
  if (existingChannel) {
    existingChannel.delete().catch((err) => console.error(err))
    await RestorePrivates.findOneAndUpdate(
      { guildId: member.guild.id, memberId: member.id },
      {
        name: [member.user.username, member.nickname].includes(existingChannel.name) ? null : existingChannel.name, //If channel name wasn't changed - don't save
        limit: existingChannel.userLimit,
        isPublic: existingChannel.permissionsFor(member.guild.id)?.has('ViewChannel'),
        invited: existingChannel.guild.members.cache
          .filter(
            (member) => member.id !== member.guild.ownerId && existingChannel.permissionOverwrites.cache.get(member.id)?.allow.has('ViewChannel')
          )
          .map((member) => member.id),
        kicked: existingChannel.guild.members.cache
          .filter(
            (member) => member.id !== member.guild.ownerId && existingChannel.permissionOverwrites.cache.get(member.id)?.deny.has('ViewChannel')
          )
          .map((member) => member.id),
      },
      { upsert: true }
    )
  }

  privateChannels.delete(member.id)
}

interface TimeoutsI {
  [key: string]: NodeJS.Timeout
}
export const timeouts: TimeoutsI = {}

export const handlePrivateChannelTimeout = async (oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
  if (!oldVoiceState.member || !newVoiceState.member) return
  if (oldVoiceState.channelId === newVoiceState.channelId) return

  privateChannels.forEach((i) => {
    if (oldVoiceState.channel?.id === i.channel.id) {
      if (oldVoiceState.channel.members.size > 0) return

      timeouts[i.channel.id] = setTimeout(() => {
        removePrivateChannel(oldVoiceState.member as GuildMember)
        clearTimeout(timeouts[i.channel.id])
        delete timeouts[i.channel.id]
      }, 60000)
    } else if (newVoiceState.channel?.id === i.channel.id) {
      const timeout = timeouts[i.channel.id]
      if (!timeout) return
      clearTimeout(timeouts[i.channel.id])
      delete timeouts[i.channel.id]
    }
  })
}

export const restorePrivateChannel = async (member: GuildMember, channel: VoiceChannel) => {
  const savedChannel = await RestorePrivates.findOne({ guildId: member.guild.id, memberId: member.id })
  if (savedChannel) {
    channel.edit({
      name: savedChannel.name,
      userLimit: savedChannel.limit,
      permissionOverwrites: [
        savedChannel.isPublic
          ? { id: member.guild.id, allow: [PermissionFlagsBits.ViewChannel] }
          : { id: member.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      ],
    })

    savedChannel.invited.push(member.id)
    if (savedChannel.invited.length > 0)
      savedChannel.invited.forEach((id) => {
        const user = member.guild.members.cache.get(id)
        if (user) channel.permissionOverwrites.edit(user, { ViewChannel: true })
      })
    if (savedChannel.kicked.length > 0)
      savedChannel.kicked.forEach((id) => {
        const user = member.guild.members.cache.get(id)
        if (user) channel.permissionOverwrites.edit(user, { ViewChannel: false })
      })

    await RestorePrivates.findOneAndRemove({ guildId: member.guild.id, memberId: member.id })
  }
}
