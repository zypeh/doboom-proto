'use strict'

export default (sequelize, DataTypes: Object) => {
  // Definition
  const STRING_NOTNULLABLE = { type: DataTypes.STRING, allowNull: false }

  const User = sequelize.define('User', {
    id: {
      comment: `This is PG database's primary key, private.`,
      type: DataTypes.INTEGER,
      autoincrement: true,
      primaryKey: true
    },
    // Oauth information
    Username: STRING_NOTNULLABLE, // @username
    Name:     STRING_NOTNULLABLE,
    // Email:    STRING_NOTNULLABLE,
    Avatar:   STRING_NOTNULLABLE,
  })
  return User
}
