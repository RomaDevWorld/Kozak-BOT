/* eslint-disable no-unused-vars */
export interface ModulesI {
  guildId: string
  logChannel: string
  owner: string
  lobby: {
    channel: string
    category: string
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