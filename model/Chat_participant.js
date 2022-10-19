const Chat_participant = (Sequelize, DataTypes) => {
    const model = Sequelize.define(
        "chat_participant",
        {
            id : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                allowNull : false,
                autoIncrement : true
            },
            room_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            user_id : {
                type : DataTypes.STRING(15),
                allowNull : false
            }
        },
        {
          tableName: "chat_participant",
          freezeTableName: true,
          timestamps: false,
        }
    );
    return model;
};
module.exports = Chat_participant