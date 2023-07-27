import { Schema, SchemaTypes, model } from 'mongoose'

const RRSchema = new Schema(
  {
    guildId: {
      type: SchemaTypes.String,
      required: true,
    },
    userId: {
      type: SchemaTypes.String,
      required: true,
    },
    nickname: {
      type: SchemaTypes.String,
      default: null,
    },
    roles: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

export default model('RestoreRoles', RRSchema)
