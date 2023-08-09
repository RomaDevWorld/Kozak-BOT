import { Attachment, Collection } from 'discord.js'

const parseMessageAttachments = (attachments: Collection<string, Attachment>) => {
  if (attachments.size < 1) return

  return attachments.size > 1 ? attachments.map((i, index) => `${index}. ${i.url}`).join('\n') : attachments.first()?.url
}

export default parseMessageAttachments
