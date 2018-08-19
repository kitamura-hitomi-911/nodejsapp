var users = { 'tkr': 'password' };  // ユーザーパスワード
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('board_data.sqlite3');

// db.serialize(() => {
// 	db.all("select * from users", (err, rows) => {
// 		if(!err){
// 			console.log(rows);
// 			console.log('kita');
// 		}
// 	})
// });

module.exports = function(req, res, next) {

	var method = req.method.toLowerCase();
	var user = req.body;
	var logout = (method === 'post' && req.url === '/logout');
	var login = (method === 'post' && user);

	// ログアウト
	if (logout) {
		delete req.session.user;
	}

	// ログイン
	if (login) {
		Object.keys(users).forEach(function(name) {
			if (user.name === name && user.pwd === users[name]) {
				req.session.user = {
					name: user.name,
					pwd: user.pwd
				};
			}
		});
	}

	// ログイン画面ではない かつ セッションが無ければ ログイン画面へ
	if(!req.session.user && !req.url.match(/^\/login/)){
		res.redirect('/login?rturl='+encodeURIComponent(req.url));
	}else{
		next();
	}
};