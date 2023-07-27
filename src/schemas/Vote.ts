import { Schema, model } from 'mongoose'

const VoteSchema = new Schema({
  authorId: {
    type: String,
    required: true,
  },
  options: [
    {
      name: {
        type: String,
      },
      value: {
        type: [String],
      },
    },
  ],
})

export default model('votes', VoteSchema)
