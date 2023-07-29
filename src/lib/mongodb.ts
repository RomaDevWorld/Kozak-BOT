import mongoose from 'mongoose'
import { config } from 'dotenv'
config()

mongoose
  .connect(process.env.MONGOURL as string)
  // eslint-disable-next-line no-console
  .then(() => console.log(`[MongoDB] Connected to MongoDB`))
  .catch((err) => console.error(err))
export default mongoose
