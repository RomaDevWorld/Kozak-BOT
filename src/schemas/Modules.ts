import { SchemaTypes, Schema, model } from 'mongoose'

export const logTypes = {
  messageDelete: { type: SchemaTypes.Boolean, default: false },
  messageUpdate: { type: SchemaTypes.Boolean, default: false },
  guildMemberAdd: { type: SchemaTypes.Boolean, default: false },
  guildMemberRemove: { type: SchemaTypes.Boolean, default: false },
  guildMemberNicknameUpdate: { type: SchemaTypes.Boolean, default: false },
  guildMemberRolesUpdate: { type: SchemaTypes.Boolean, default: false },
  guildMemberTimeout: { type: SchemaTypes.Boolean, default: false },
  voiceStateUpdate: { type: SchemaTypes.Boolean, default: false },
  guildBanRemove: { type: SchemaTypes.Boolean, default: false },
  guildBanAdd: { type: SchemaTypes.Boolean, default: false },
  guildMemberReport: { type: SchemaTypes.Boolean, default: false },
  guildMemberWarn: { type: SchemaTypes.Boolean, default: false },
}

const ModulesSchema = new Schema({
  guildId: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },
  log: {
    channel: {
      type: SchemaTypes.String,
      unique: true,
      default: null,
    },
    ignoredChannels: {
      type: [SchemaTypes.String],
      default: [],
    },
    ignoredRoles: {
      type: [SchemaTypes.String],
      default: [],
    },
    types: logTypes,
  },
  lobby: {
    channel: {
      type: SchemaTypes.String,
      unique: true,
      default: null,
    },
  },
  counter: {
    channelId: {
      type: SchemaTypes.String,
      unique: true,
      default: null,
    },
    label: {
      type: SchemaTypes.String,
      default: null,
    },
  },
  roles: {
    autorole: {
      type: SchemaTypes.String,
      default: null,
    },
    restore: {
      status: { type: SchemaTypes.Boolean, default: false },
      expireTime: {
        type: SchemaTypes.Number,
        default: 86400000 * 7, // 7 days
      },
    },
  },
  leveling: {
    status: { type: SchemaTypes.Boolean, default: false },
    minXp: {
      type: SchemaTypes.Number,
      default: 5,
    },
    maxXp: {
      type: SchemaTypes.Number,
      default: 15,
    },
    cooldown: {
      type: SchemaTypes.Number,
      default: 15 * 1000, // 15 seconds
    },
    notifications: {
      onLvlUp: { type: SchemaTypes.Boolean, default: false },
    },
    ignoredChannels: {
      type: [SchemaTypes.String],
      default: [],
    },
    ignoredRoles: {
      type: [SchemaTypes.String],
      default: [],
    },
  },
  starboard: {
    status: { type: SchemaTypes.Boolean, default: false },
    channelId: {
      type: SchemaTypes.String,
      default: null,
    },
    emoji: {
      type: SchemaTypes.String,
      default: '⭐',
    },
    threshold: {
      type: SchemaTypes.Number,
      default: 3,
    },
  },
})

export default model('modules', ModulesSchema)
