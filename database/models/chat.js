module.exports = (sequelize, DataTypes) => {
  const chat = sequelize.define('chat', {
    id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'chat',
    timestamps: true
  })
  return chat
}
