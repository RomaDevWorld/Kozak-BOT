import { Schema, SchemaTypes, model } from 'mongoose'

const StarboardMessagesSchema = new Schema({
  messageId: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },
  count: {
    type: SchemaTypes.Number,
    required: true,
  },
  starboardMessageId: {
    type: SchemaTypes.String,
    required: true,
  },
})

export default model('starboard-messages', StarboardMessagesSchema)
