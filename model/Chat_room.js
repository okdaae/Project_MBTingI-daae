const Chat_room = (Sequelize, DataTypes) => {
    const model = Sequelize.define(
        "chat_room",
        {
            room_id : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                allowNull : false,
                autoIncrement : true
            },
            room_title : {
                type : DataTypes.STRING(100),
                allowNull : false
            },
            content :{
                type: DataTypes.TEXT('long'),

            },
            content_timestamp : {
                type : DataTypes.DATE
            }
        },
        {
          tableName: "chat_room",
          freezeTableName: true,
          timestamps: false,
        }
    );
    return model;
};
module.exports = Chat_room