import { Client, Guild, GuildMember, Invite, PermissionFlagsBits } from 'discord.js'

const globalInvites = new Map<string, Map<string, number>>()

export const cacheAllInvites = async (client: Client) => {
  client.guilds.cache.forEach(async (guild) => {
    if (!guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) return
    const invites = await guild.invites.fetch().catch((err: Error) => console.error(err.message))
    if (!invites) return

    const codeUses = new Map<string, number>()

    invites.each((invite) => codeUses.set(invite.code, invite.uses || 0))

    globalInvites.set(guild.id, codeUses)
  })

  // eslint-disable-next-line no-console
  console.log('[Invite tracker] Successfully cached invites')
}

export const trackInvite = async (member: GuildMember) => {
  if (!member.guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) return

  const cachedInvites = globalInvites.get(member.guild.id)
  if (!cachedInvites) return
  const newInvites = await member.guild.invites.fetch().catch((err) => console.error(err))

  try {
    const usedInvite = newInvites?.find((invite) => (cachedInvites?.get(invite.code) as number) < (invite.uses as number) || 0)
    return usedInvite
  } catch (error) {
    console.error(error)
  }

  newInvites?.each((invite) => cachedInvites?.set(invite.code, invite.uses || 0))
  globalInvites.set(member.guild.id, cachedInvites)
}

export const update = async (invite: Invite) => {
  if (!invite.guild) return
  if ((invite.guild as Guild).members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) return

  const invites = await (invite.guild as Guild).invites.fetch().catch((err) => console.error(err))

  const codeUses = new Map<string, number>()

  invites?.each((invite) => codeUses.set(invite.code, invite.uses || 0))

  globalInvites.set(invite.guild.id, codeUses)
}

export const cacheOne = async (guild: Guild) => {
  if (!guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild)) return

  const invites = await guild.invites.fetch().catch((err) => console.error(err))

  const codeUses = new Map<string, number>()

  invites?.each((invite) => codeUses.set(invite.code, invite.uses || 0))

  globalInvites.set(guild.id, codeUses)
}
