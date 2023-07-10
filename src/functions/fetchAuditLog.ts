import { AuditLogEvent, Guild, PermissionFlagsBits } from 'discord.js'

const fetchAuditLog = async (guild: Guild, type: AuditLogEvent) => {
  if (!guild.members.me?.permissions.has(PermissionFlagsBits.ViewAuditLog)) return

  const audit = await guild.fetchAuditLogs({
    limit: 1,
    type,
  })

  return audit.entries.first()
}

export default fetchAuditLog
