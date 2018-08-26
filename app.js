var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path'); // ファイルバスを扱うユーティリティ
var favicon = require('serve-favicon'); // ファビコンを表示する
var cookieParser = require('cookie-parser'); // クッキーをパースする
var bodyParser = require('body-parser'); // リクエストパラメータのパーサーを設定する
var session = require('express-session'); // セッションを利用
var validator = require('express-validator');
var logger = require('morgan'); // HTTPリクエストのログを吐き出す

// アサインする変数
var assignObj = require('./assignObj');

var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var messageRouter = require('./routes/message');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

var session_opt = {
	secret:'secret', // 指定した文字列を使ってクッキーIDを暗号化しクッキーIDが書き換えらているかを判断
	resave:false, // セッションにアクセスすると上書きされるオプション
	saveUninitialized: false, // 未初期化状態のセッションも保存するようなオプション
	cookie:{
		httpOnly:true, // クライアント側でクッキー値を見れない、書きかえれないようにするオプション
		secure:false, // httpsで使用する場合はtrue
		maxAge:60 * 60 * 1000 // 最後のアクセスから1時間セッション保持
	}
};
app.use(session(session_opt));

app.use(require('./auth'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
app.use('/message', messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
