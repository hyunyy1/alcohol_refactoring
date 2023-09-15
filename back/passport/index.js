const passport = require('passport');
const local = require('./localStrategy');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database.js');

const connection = mysql.createConnection(dbConfig);  // db연결

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user[0].user_id);
  });

  passport.deserializeUser((id, done) => {
    console.log('deserializeUser');
    const sql = `SELECT * FROM User WHERE user_id=?`;
    connection.query(sql, [id], (err, user) => {
      if (err) {
        console.error(err);
      }
      done(null, user);
    });
  });
  
  local();
};