/* eslint-disable no-unused-vars */
export interface ModulesI {
  guildId: string
  log: {
    channel: string | null
    types: {
      messageUpdate: boolean
      messageDelete: boolean
      guildMemberAdd: boolean
      guildMemberRemove: boolean
      guildMemberNicknameUpdate: boolean
      guildMemberRolesUpdate: boolean
      guildMemberTimeout: boolean
      voiceStateUpdate: boolean
      guildBanAdd: boolean
      guildBanRemove: boolean
    }
  }
  owner: string
  lobby: {
    channel: string | null
    category: string | null
  }
}

export interface VotesI {
  authorId: string
  options:
    | {
        name: string
        value: string[] | []
      }[]
}

interface WarnsI {
  guildId: string
  userId: string
  warns: { modId: string; reason: string | null; dateTimestamp: number }[]
}
