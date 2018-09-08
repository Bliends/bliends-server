module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'group',
    timestamps: true
  })
  return group
}
