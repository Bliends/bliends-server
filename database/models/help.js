module.exports = (sequelize, DataTypes) => {
  const help = sequelize.define('help', {
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
    situation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'help',
    timestamps: true
  })
  return help
}
