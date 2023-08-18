import { Schema, SchemaTypes, model } from 'mongoose'

const XPSchema = new Schema({
  memberId: {
    type: SchemaTypes.String,
    required: true,
  },
  guildId: {
    type: SchemaTypes.String,
    required: true,
  },
  xp: {
    type: SchemaTypes.Number,
    default: 0,
    required: true,
  },
})

export default model('xps', XPSchema)
