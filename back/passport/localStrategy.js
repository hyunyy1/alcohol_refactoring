const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database.js');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',  // req.body.email
    passwordField: 'password',  // req.body.password
  }, async (email, password, done) => {
    try {
      const connection = await mysql.createConnection(dbConfig);  // db연결
      const sql = `SELECT * FROM User WHERE user_email=?`;
      const [exUser] = await connection.query(sql, [email]);
      if (exUser.length !== 0) {
        const result = await bcrypt.compare(password, exUser[0].user_password);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비번틀림' });
        }
      } else {
        done(null, false, { message: '가입되지않은회원' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};