import { Invite } from 'discord.js'
import { BotEvent } from '../@types/discord'
import { update } from '../functions/trackInvites'

const event: BotEvent = {
  name: 'inviteCreate',
  once: false,
  execute: (invite: Invite) => {
    update(invite)
  },
}

export default event
