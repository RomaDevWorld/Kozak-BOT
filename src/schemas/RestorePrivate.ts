import { Schema, SchemaTypes, model } from 'mongoose'

const RestorePrivatesSchema = new Schema(
  {
    guildId: {
      type: SchemaTypes.String,
      required: true,
    },
    memberId: {
      type: SchemaTypes.String,
      required: true,
    },
    name: SchemaTypes.String,
    isPublic: SchemaTypes.Boolean,
    invited: [SchemaTypes.String],
    kicked: [SchemaTypes.String],
    limit: SchemaTypes.Number,
  },
  { timestamps: true }
)

export default model('RestorePrivates', RestorePrivatesSchema)
