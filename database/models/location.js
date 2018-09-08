module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
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
    }
  },
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'location',
    timestamps: true
  })
  return location
}
