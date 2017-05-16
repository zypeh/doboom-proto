'use strict'

import fs from 'fs'
import path from 'path'
import sequelize from '../database'

const db: Object = {}

fs.readdirSync(__dirname)
  .filter(file => ((file.indexOf('.') !== 0) && (file !== 'index.js')))
  .map(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).map(model_name => {
  if ('associate' in db[model_name])
    db[model_name].associate(db)
})

db.sequelize = sequalize
db.Sequelize = Sequelize

export default db
