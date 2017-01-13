'use strict'

import app from './server'
import { databaseConnector } from './server/db'

const port: number = process.env.POST || 8080
const dbConfig: string = (process.env.NODE_DEV === 'production')
  ? 'production'
  : 'development'

;(async () => {

  // Connect to database
  try {
    const info = await databaseConnector(dbConfig)
    console.log(`${'*'.green}] Connected to ${info.host}:${info.port}/${info.name}`)
  } catch (e) {
    console.log(`[${'!'.red}] Unable to connect to database`)
  }

  await app.listen(port)
  console.log(`${'@'.green}] Server listening on port ${port}`)

})()
