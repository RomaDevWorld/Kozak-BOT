import { readdirSync } from 'fs'
import { join } from 'path'
import client from './lib/client'
import mongoose from './lib/mongodb'
import i18next from './lib/i18next'

const handlersDir = join(__dirname, './handlers')
readdirSync(handlersDir).forEach((handler) => {
  require(`${handlersDir}/${handler}`)(client)
})

mongoose // Init mongoose
i18next // Init i18next
