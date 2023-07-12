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
