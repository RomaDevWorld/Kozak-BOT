import { Schema, model } from 'mongoose'
import { VotesI } from '../@types/schemas'

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

export default model<VotesI>('votes', VoteSchema)
