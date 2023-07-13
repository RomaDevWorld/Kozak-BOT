import { ChannelType, GuildMember, PermissionFlagsBits, VoiceChannel, VoiceState } from 'discord.js'
import Modules from '../schemas/Modules'

export const handleLobbyJoin = async (newVoiceState: VoiceState) => {
  if (!newVoiceState.channel || !newVoiceState.member || newVoiceState.member.user.bot) return

  const data = await Modules.findOne({ guildId: newVoiceState.channel?.guild.id })
  if (!data || data.lobby.channel !== newVoiceState.channel.id) return

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

export const removePrivateChannel = (member: GuildMember) => {
  const existingChannel = getPrivateChannel(member)
  if (existingChannel) existingChannel.delete().catch((err) => console.error(err))

  privateChannels.delete(member.id)
}

interface TimeoutsI {
  [key: string]: NodeJS.Timeout
}
const timeouts: TimeoutsI = {}

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