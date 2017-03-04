'use strict'

import app from './backend'
import colors from 'colors'
import { databaseConnector } from './backend/database'

const port: number = process.env.PORT || 8080
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
  console.log(`$[{'@'.green}] Server listening on port ${port}`)

})()
