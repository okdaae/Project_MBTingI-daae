const Mbtibad = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "mbtibad",
    {
      mbti: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      bad: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
    },
    {
      tableName: "mbtibad",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};
module.exports = Mbtibad;
