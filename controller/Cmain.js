const { Userinfo, Sequelize } = require("../model/main");

exports.main = (req, res) => {
  const user = req.session.user;
  Userinfo.findAll({
    where: {},
  }).then((result) => {
    if (user != undefined) {
      res.render("index", {
        isLogin: true,
        user: user[0],
        img: user[4],
        userinfo: result,
      });
      console.log("1", result[1].mbti);
    } else {
      res.render("index", {
        isLogin: false,
        user: "",
        img: "",
        userinfo: result,
      });
      console.log("2", result[1].mbti);
    }
  });
};

exports.logout = (req, res) => {
  const user = req.session.user;
  if (user != undefined) {
    req.session.destroy((err) => {
      res.send(
        `<script>
          location.href="/";
        </script>`
      );
    });
  } else {
    res.send(
      `<script>
      alert("잘못된 접근입니다.");
      location.href="/";
      </script>`
    );
  }
};
