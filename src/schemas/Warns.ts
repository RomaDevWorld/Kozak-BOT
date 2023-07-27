import { Schema, model } from 'mongoose'

const WarnSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  warns: {
    type: [
      {
        modId: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
          required: false,
        },
        dateTimestamp: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
})

export default model('warns', WarnSchema)
