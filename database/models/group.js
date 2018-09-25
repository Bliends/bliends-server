const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    tableName: 'group',
  })
  return group
}
