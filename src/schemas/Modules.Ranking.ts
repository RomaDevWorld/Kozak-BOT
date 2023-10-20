import { Schema, SchemaTypes, model } from 'mongoose'

const ModulesRankingSchema = new Schema({
  guildId: {
    type: SchemaTypes.String,
    required: true,
  },
  roleId: {
    type: SchemaTypes.String,
    required: true,
  },
  lvl: {
    type: SchemaTypes.Number,
    required: true,
  },
})

export default model('modules_ranking', ModulesRankingSchema)
