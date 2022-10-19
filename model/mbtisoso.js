const Mbtisoso = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "mbtisoso",
    {
      mbti: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      soso: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
    },
    {
      tableName: "mbtisoso",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};
module.exports = Mbtisoso;
