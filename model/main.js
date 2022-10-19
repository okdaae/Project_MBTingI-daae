const Sequelize = require("sequelize");
const config = require("../config/config.json")["local"];
// const config = require("../config/config.json")["mysql"];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Userinfo = require("./Userinfo")(sequelize, Sequelize);
db.Mbtibest = require("./Mbtibest")(sequelize, Sequelize);
db.Mbtigood = require("./Mbtigood")(sequelize, Sequelize);
db.Mbtisoso = require("./Mbtisoso")(sequelize, Sequelize);
db.Mbtibad = require("./Mbtibad")(sequelize, Sequelize);
db.Chat_room = require("./Chat_room")(sequelize, Sequelize);
db.Chat_participant = require("./Chat_participant")(sequelize, Sequelize);

// foreignKey  설정
db.Userinfo.hasMany(db.Chat_participant, {
  foreignKey: "user_id",
  sourceKey: "id",
  onUpdate: "cascade",
  onDelete: "cascade",
});

db.Chat_participant.belongsTo(db.Userinfo, {
  foreignKey: "user_id",
  sourceKey: "id",
  onUpdate: "cascade",
  onDelete: "cascade",
}); //이상 participant(user_id) - userinfo (id)

db.Chat_room.hasMany(db.Chat_participant, {
  foreignKey: "room_id",
  sourceKey: "room_id",
  onUpdate: "cascade",
  onDelete: "cascade",
});

db.Chat_participant.belongsTo(db.Chat_room, {
  foreignKey: "room_id",
  sourceKey: "room_id",
  onUpdate: "cascade",
  onDelete: "cascade",
}); //이상 participant(room_id) - room(room_id)

module.exports = db;
