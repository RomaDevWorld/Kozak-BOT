import { Schema, SchemaTypes, model } from 'mongoose'

interface RRSchemaI {
  guildId: string
  userId: string
  nickname: string | null
  roles: string[]
  updatedAt: Date
}

const RRSchema = new Schema<RRSchemaI>(
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
