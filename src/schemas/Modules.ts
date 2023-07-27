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
  tickets: [
    {
      channelId: {
        type: SchemaTypes.String,
      },
      messageId: {
        type: SchemaTypes.String,
      },
      allowedRoles: [String],
    },
  ],
})

export default model('modules', ModulesSchema)
