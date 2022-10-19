const express = require("express");
const axios = require("axios");
const session = require("express-session");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = 3000;

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));
app.use("/axios", express.static("node_modules/axios"));
app.use("/slick", express.static("node_modules/slick-carousel/slick"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// 세션
app.use(
  session({
    secret: "1234",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

const router = require("./routes");

app.use("/", router);

io.on("connection", function (socket) {
  // 최초 입장했을 때
  console.log("Server Socket Connected", socket.id);

  socket.on("room", (data) => {
    console.log("data", data);
    socket.join(data);
  });

  socket.on("chatlistUp", (data) => {
    socket.emit("chatlistUpdate", data);
  });

  socket.on("send", (data) => {
    const sendData = {
      sendNick: data.sendNick,
      msg: data.msg,
      sendTime: data.time,
    };

    io.to(data.roomid).emit("newMessage", sendData);
  });

  socket.on("alert", (data) => {
    console.log("alert", data);
    console.log(data.roomid);
    io.to(data.roomid).emit("alertData", data);
  });
});

http.listen(port, () => {
  console.log("server open: ", port);
});
