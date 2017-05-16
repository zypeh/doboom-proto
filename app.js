'use strict'

import app from './backend'
import colors from 'colors'

const port: number = process.env.PORT || 8080

;(async () => {
  await app.listen(port)
  console.log(`[${'@'.green}] Server listening on port ${port}`)
})()
