import mongoose from 'mongoose'
import { config } from 'dotenv'
config()

mongoose
  .connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)
  .then(() => console.log(`[MongoDB] Connected to ${process.env.DB_HOST}@${process.env.DB_NAME}`))
  .catch((err) => console.error(err))
export default mongoose
