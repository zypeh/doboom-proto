'use strict'

export default (sequelize, DataTypes: Object) => {
  // Definition
  const STRING_NOTNULLABLE = { type: DataTypes.STRING, allowNull: false }
  const ARRAY = { type: DataTypes.ARRAY }

  const Organization = sequelize.define('Organization', {
    id: {
      comment: `This is PG database's primary key, private.`,
      type: DataTypes.INTEGER,
      autoincrement: true,
      primaryKey: true
    },
    // Organization
    Username:  STRING_NOTNULLABLE,
    Name:      STRING_NOTNULLABLE,
    Avatar:    STRING_NOTNULLABLE,

    Tagline:   STRING_NOTNULLABLE,
    Members:   ARRAY(STRING_NOTNULLABLE),
    Products:  ARRAY(STRING_NOTNULLABLE),
  })
  return Organization
}
