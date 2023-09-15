const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database.js');

const router = express.Router();

// 회원가입
router.post('/signup', isNotLoggedIn, async (req, res, next) => {
  const { email, nickname, pw, pwConfirm, phonenumber } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);  // db연결
    let sql = `SELECT * FROM User WHERE user_email=?`;
    const [exUser] = await connection.query(sql, [email]);
    if (exUser.length !== 0) {
      return res.send('중복ID');
    } 
    const hash = await bcrypt.hash(pw, 12);
    const data = {
      user_email: email,
      user_nickname: nickname,
      user_password: hash,
      user_phonenumber: phonenumber,
    };
    sql = `INSERT INTO User SET ?`;
    connection.query(sql, [data], (err, rows) => {
      if (err) {
        console.error(err);
      } else{
        return res.send('가입성공');
      }      
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


// 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', { session: true }, (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.send(`${info.message}`);
    } else {
      // 로그인 성공
      return req.login(user, (loginError) => {  // passport>index.js로 이동
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        req.session.user_id = user[0].user_id;
        console.log(req.user);
        console.log(req.isAuthenticated());  // true
        const localnickname = user[0].user_nickname;
        return res.send("로그인성공," + localnickname);
      });
    }
  })(req, res, next);
});


// 로그아웃
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    } else {
      req.session.destroy();
      res.send('로그아웃완료');
    }
  });
});

module.exports = router;