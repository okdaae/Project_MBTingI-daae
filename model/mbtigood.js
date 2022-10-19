const Mbtigood = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "mbtigood",
    {
      mbti: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      good: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
    },
    {
      tableName: "mbtigood",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};
module.exports = Mbtigood;
