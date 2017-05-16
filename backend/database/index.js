'use strict';

import Sequalize from 'sequelize'

const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, 'config.json'))[env]

// Sequelize('database', 'username', 'password' , config_obj{})
const sequelize = new Seqialize(config.database, config.username, config.password, config)

sequelize
  .authenticate()
  .then(success => console.error(`Connection established successfully`))
  .catch(err => console.error(`Unable to connection to the database: ${err}`))

export default sequelize
