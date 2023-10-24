import { Schema, SchemaTypes, model } from 'mongoose'

const ModulesTicketsSchema = new Schema({
  guildId: {
    type: SchemaTypes.String,
    required: true,
  },
  prefix: {
    type: SchemaTypes.String,
    required: true,
    default: 'ticket',
  },
  categoryId: {
    type: SchemaTypes.String,
    required: true,
  },
  messageId: {
    type: SchemaTypes.String,
    required: true,
  },
  allowedRoles: {
    type: [SchemaTypes.String],
    default: [],
  },
})

export default model('modules_tickets', ModulesTicketsSchema)
