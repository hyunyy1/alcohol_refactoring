const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dotenv = require('dotenv');
const passport = require('passport');
dotenv.config();
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');
const path = require('path');
const cors = require('cors');

const options = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: "hyunyy1@",
  database: "finaldb",
  clearExpired: true,
  checkExpirationInterval: 1000 * 60 * 2,  //세션 유효기간 체크하는 시간 설정: 2분
  expiration: 1000 * 60,  //세션 유효기간 설정: 1분
}
const sessionStore = new MySQLStore(options);
sessionStore.onReady().then(() => {
  console.log('MySQLStore ready');
}).catch(error => {
  console.error(error);
});

const app = express();
app.set('port', process.env.PORT || 8001);
passportConfig();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: sessionStore,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000", //session 인증 react
    credentials: true, //session 인증 react axios
  })
);

// 라우터 연결
app.use('/auth', authRouter);

// 404 에러처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);  // 에러 미들웨어로 넘어감
});

// 에러 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});