import { readdirSync } from 'fs'
import { join } from 'path'
import client from './lib/client'
import mongoose from './lib/mongodb'

const handlersDir = join(__dirname, './handlers')
readdirSync(handlersDir).forEach((handler) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(`${handlersDir}/${handler}`)(client)
})

mongoose // Init mongoose
