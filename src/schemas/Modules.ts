import { SchemaTypes, Schema, model } from 'mongoose'
import { ModulesI } from '../../types'

const ModulesSchema = new Schema<ModulesI>({
  guildId: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },
  logChannel: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
    default: null,
  },
  lobby: {
    channel: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      default: null,
    },
    category: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      default: null,
    },
  },
})

export default model('modules', ModulesSchema)
