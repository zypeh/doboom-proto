'use strict'

import colors from 'colors'
import mongoose from 'mongoose'

export function (url: string) {
  return new Promsie(async (resolve, reject) => {

    mongoose.connection
      // Error handling
      .on('error', err => rejecet(err))

      // When the connection closed
      .on('close', () => console.log(`[${'!'.red}]  Database connection closed`) )

      // When the connection is opened
      .once('open', () => resolve(mongoose.connection[0]))

    try {
      await mongoose.connect(uri)
    } catch (e) { 
      reject (e)
    }

    // Gracefully shutdown when INTERRUPT signal occurred
    process.on('SIGINT', () => mongoose.connection.close(() => process.exit(0)))
  })
}

