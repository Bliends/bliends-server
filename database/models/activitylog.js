module.exports = (sequelize, DataTypes) => {
  const activitylog = sequelize.define('activitylog', {
    id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    payments: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'activitylog',
    timestamps: true
  })
  return activitylog
}
