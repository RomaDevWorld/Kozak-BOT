import { SchemaTypes, Schema, model } from 'mongoose'
import { ModulesI } from '../@types/schemas'

const ModulesSchema = new Schema<ModulesI>({
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
    types: {
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
    },
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
})

export default model<ModulesI>('modules', ModulesSchema)
