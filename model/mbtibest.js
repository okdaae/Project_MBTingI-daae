const Mbtibest = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "mbtibest",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      mbti: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      best: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
    },
    {
      tableName: "mbtibest",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};
module.exports = Mbtibest;
