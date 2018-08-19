module.exports = function(req, res, next) {

	// ログアウト
	if (req.url === '/logout') {
		delete req.session.user_id;
	}

	// ログイン画面ではない かつ ログアウト画面ではない かつ セッションが無ければ ログイン画面へ
	if(!req.session.user_id && !req.url.match(/^\/login/) && !req.url.match(/^\/logout/)){
		res.redirect('/login?rturl='+encodeURIComponent(req.url));
	}else{
		next();
	}
};