const {
  Userinfo,
  Sequelize,
  Mbtibest,
  Mbtigood,
  Mbtisoso,
  Mbtibad,
} = require("../model/main");

exports.signup = (req, res) => {
  res.render("signup");
};

exports.signup_post = (req, res) => {
  var data = {
    mbti: req.body.mbti,
    id: req.body.id,
    pw: req.body.pw,
    email: req.body.email,
    name: req.body.name,
    birth: req.body.birth,
    nick: req.body.nick,
    gender: req.body.gender,
  };
  Userinfo.findOne({
    where: {
      [Sequelize.Op.or]: [
        { id: req.body.id },
        { email: req.body.email },
        { nick: req.body.nick },
      ],
    },
  }).then((result) => {
    if (result == null) {
      Userinfo.create(data).then(() => {
        res.send("가입완료");
      });
    } else if (req.body.id == result.id) {
      res.send("같은 ID의 사용자가 있습니다.");
    } else if (req.body.email == result.email) {
      res.send("같은 email의 사용자가 있습니다.");
    } else if (req.body.nick == result.nick) {
      res.send("같은 닉네임 사용자가 있습니다.");
    }
  });
};

exports.signin = (req, res) => {
  res.render("signin");
};

exports.signin_post = (req, res) => {
  Userinfo.findOne({
    where: {
      id: req.body.id,
      pw: req.body.pw,
    },
  }).then((result) => {
    if (result && req.body.sessions == "on") {
      req.session.user = [
        result.name,
        result.id,
        result.mbti,
        result.gender,
        result.imgurl,
      ];
      res.send("로그인완료");
    } else if (result && req.body.sessions == undefined) {
      req.session.user = [
        result.name,
        result.id,
        result.mbti,
        result.gender,
        result.imgurl,
      ];
      req.session.cookie.originalMaxAge = 2 * 60 * 60 * 1000;
      res.send("로그인완료");
    } else if (!result) {
      res.send("ID와 PW를 확인하세요.");
    }
  });
};

// 아이디 비밀번호 찾기
exports.find = (req, res) => {
  res.render("find");
};

exports.find_id = (req, res) => {
  Userinfo.findOne({
    where: {
      email: req.body.email,
      nick: req.body.nick,
    },
  }).then((result) => {
    if (result) {
      res.send({ msg: "아이디찾기성공", id: result.id });
    } else {
      res.send({ msg: "아이디찾기실패" });
    }
  });
};

exports.find_pw = (req, res) => {
  Userinfo.findOne({
    where: {
      id: req.body.id,
      email: req.body.email,
    },
  }).then((result) => {
    if (result) {
      res.send({ msg: "비밀번호찾기성공", pw: result.pw });
    } else {
      res.send({ msg: "비밀번호찾기실패" });
    }
  });
};

// profile

exports.profile = (req, res) => {
  const user = req.session.user;
  if (user != undefined) {
    Userinfo.findOne({
      where: {
        id: req.session.user[1],
        name: req.session.user[0],
      },
    }).then((result) => {
      var date = new Date();
      var year = date.getFullYear();
      var resultbirth = result.birth;
      var userbirth = resultbirth.substr(0, 4);
      var age = year - userbirth + 1;
      var mbti = result.mbti.toUpperCase();
      res.render("profile", {
        nick: result.nick,
        mbti: mbti,
        age: age,
      });
    });
  } else {
    res.send(
      `<script>
        alert("잘못된 접근입니다. 로그인 후 이용해주세요.");
        location.href="/signin";
        </script>`
    );
  }
};

exports.profile_upload = (req, res) => {
  Userinfo.update(
    {
      imgurl: "/uploads/" + req.file.filename,
      job: req.body.job,
      userdesc: req.body.userdesc,
      interest: req.body.interest,
      specialty: req.body.specialty,
    },
    {
      where: {
        id: req.session.user[1],
      },
    }
  ).then((result) => {
    res.send("업로드완료");
  });
};

exports.matching = async (req, res) => {
  const mbti_list = {};
  const user_list = {};
  const user = req.session.user;
  // 남성인 유저가 로그인 하면 여성 유저 정보를 보여줌
  if (user != undefined && user[3] == "남") {
    await Mbtibest.findAll({
      where: {
        mbti: user[2],
      },
    }).then((result) => {
      mbti_list["best"] = result.map((el) => el.best);
    });
    await Mbtigood.findAll({
      where: {
        mbti: user[2],
      },
    }).then((result) => {
      mbti_list["good"] = result.map((el) => el.good);
    });
    await Mbtisoso.findAll({
      where: {
        mbti: user[2],
      },
    }).then((result) => {
      mbti_list["soso"] = result.map((el) => el.soso);
    });
    // ...(전개 연산자)을 이용해 배열을 합쳐준다.
    const mbti_listA = [
      ...mbti_list.best,
      ...mbti_list.good,
      ...mbti_list.soso,
    ];

    Userinfo.findAll({
      where: {
        id: !user[1],
        gender: "여",
        mbti: mbti_listA,
      },
    }).then((result) => {
      user_list["id"] = result.map((el) => el.id);
      user_list["img"] = result.map((el) => el.imgurl);
      user_list["nick"] = result.map((el) => el.nick);
      user_list["mbti"] = result.map((el) => el.mbti);
      user_list["age"] = result.map((el) => {
        var date = new Date();
        var year = date.getFullYear();
        var resultbirth = el.birth;
        var userbirth = resultbirth.substr(0, 4);
        var age = year - userbirth + 1;
        return age;
      });
      user_list["job"] = result.map((el) => el.job);
      user_list["interest"] = result.map((el) => el.interest);
      user_list["specialty"] = result.map((el) => el.specialty);
      user_list["userdesc"] = result.map((el) => el.userdesc);
      // 유저의 정보 수 만큼 랜덤 숫자가 담긴 배열을 생성
      let randomArray = [];
      while (randomArray.length < user_list.nick.length) {
        random = Math.floor(Math.random() * user_list.nick.length);
        if (randomArray.indexOf(random) === -1) {
          randomArray.push(random);
        }
      }
      // 생성된 배열을 이용해 mbti 궁합 배열을 생성
      let mbtiArray = [];
      for (let i = 0; i < randomArray.length; i++) {
        let mbtiUpper = user_list.mbti[i].toUpperCase();
        if (mbti_list.best.indexOf(mbtiUpper) != -1) {
          mbtiArray.push("BEST!!");
        } else if (mbti_list.good.indexOf(mbtiUpper) != -1) {
          mbtiArray.push("GOOD!");
        } else if (mbti_list.soso.indexOf(mbtiUpper) != -1) {
          mbtiArray.push("SOSO");
        }
      }
      res.render("matching", {
        user,
        user_list,
        mbti_list,
        randomArray,
        mbtiArray,
      });
    });
    // 여성인 유저가 로그인 하면 남성 유저 정보를 보여줌
  } else if (user != undefined && user[3] == "여") {
    await Mbtibest.findAll({
      where: {
        mbti: user[2],
      },
    }).then((result) => {
      mbti_list["best"] = result.map((el) => el.best);
    });
    await Mbtigood.findAll({
      where: {
        mbti: user[2],
      },
    }).then((result) => {
      mbti_list["good"] = result.map((el) => el.good);
    });
    await Mbtisoso.findAll({
      where: {
        mbti: user[2],
      },
    }).then((result) => {
      mbti_list["soso"] = result.map((el) => el.soso);
    });
    // ...(전개 연산자)을 이용해 배열을 합쳐준다.
    const mbti_listA = [
      ...mbti_list.best,
      ...mbti_list.good,
      ...mbti_list.soso,
    ];

    await Userinfo.findAll({
      where: {
        id: !user[1],
        gender: "남",
        mbti: mbti_listA,
      },
    }).then((result) => {
      user_list["id"] = result.map((el) => el.id);
      user_list["img"] = result.map((el) => el.imgurl);
      user_list["nick"] = result.map((el) => el.nick);
      user_list["mbti"] = result.map((el) => el.mbti);
      user_list["age"] = result.map((el) => {
        var date = new Date();
        var year = date.getFullYear();
        var resultbirth = el.birth;
        var userbirth = resultbirth.substr(0, 4);
        var age = year - userbirth + 1;
        return age;
      });
      user_list["job"] = result.map((el) => el.job);
      user_list["interest"] = result.map((el) => el.interest);
      user_list["specialty"] = result.map((el) => el.specialty);
      user_list["userdesc"] = result.map((el) => el.userdesc);
      // 유저의 정보 수 만큼 랜덤 숫자가 담긴 배열을 생성
      let randomArray = [];
      while (randomArray.length < user_list.nick.length) {
        random = Math.floor(Math.random() * user_list.nick.length);
        if (randomArray.indexOf(random) === -1) {
          randomArray.push(random);
        }
      }
      // 생성된 배열을 이용해 mbti 궁합 배열을 생성
      let mbtiArray = [];
      for (let i = 0; i < randomArray.length; i++) {
        let mbtiUpper = user_list.mbti[i].toUpperCase();
        if (mbti_list.best.indexOf(mbtiUpper) != -1) {
          mbtiArray.push("BEST!!");
        } else if (mbti_list.good.indexOf(mbtiUpper) != -1) {
          mbtiArray.push("GOOD!");
        } else if (mbti_list.soso.indexOf(mbtiUpper) != -1) {
          mbtiArray.push("SOSO");
        }
      }
      res.render("matching", {
        user,
        user_list,
        mbti_list,
        randomArray,
        mbtiArray,
      });
    });
  } else if (user == undefined) {
    res.send(
      `<script>
        alert("잘못된 접근입니다. 로그인 후 이용해주세요.");
        location.href="/signin";
        </script>`
    );
  }
};
exports.matching_entry = (req, res) => {
  console.log("req.body.recID", req.body.recID);
  res.render(req.body.recID);
};
