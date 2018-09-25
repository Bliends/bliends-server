const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const label = sequelize.define('label', {
    id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    importance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Date.now,
      allowNull: false,
      get: function () {
        return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Date.now,
      allowNull: false,
      get: function () {
        return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
  },
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'label',
  })
  return label
}
