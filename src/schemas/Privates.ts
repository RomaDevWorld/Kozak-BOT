import { Schema, SchemaTypes, model } from 'mongoose'

const PrivatesSchema = new Schema({
  guildId: {
    type: SchemaTypes.String,
    required: true,
  },
  memberId: {
    type: SchemaTypes.String,
    required: true,
  },
  channelId: {
    type: SchemaTypes.String,
    required: true,
  },
})

export default model('Privates', PrivatesSchema)
