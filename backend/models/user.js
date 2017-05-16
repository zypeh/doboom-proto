'use strict'

export default (sequelize, DataTypes: Object) => {
  // Definition
  const User = sequelize.define('User', {
    id: {
      comment: `This is PG database's primary key, private.`,
      type: DataTypes.INTEGER,
      autoincrement: true,
      primaryKey: true
    },
    // Oauth information
    username: { type: DataTypes.STRING, allowNull: false },
    name:     { type: DataTypes.STRING, allowNull: false },
    email:    { type: DataTypes.STRING, allowNull: false },
    avatar:   { type: DataTypes.STRING, allowNull: false },
  })
  return User
}
