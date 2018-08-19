module.exports = function(req, res, next) {


	var rturl = req.query.rturl && req.query.rturl.match(/^\//) ? req.query.rturl : '/';

	// ログアウト
	if (req.url === '/logout') {
		delete req.session.user_id;
	}

	if(!req.session.user_id && !req.url.match(/^\/login/) && !req.url.match(/^\/logout/)){
		// ログイン画面ではない かつ ログアウト画面ではない かつ セッションが無ければ ログイン画面へ
		res.redirect('/login?rturl=' + encodeURIComponent(req.url));
	}else if(req.session.user_id && req.url.match(/^\/login/)){
		// ログイン画面 かつ セッションありの場合リダイレクト
		res.redirect(rturl);
	}else{
		next();
	}
};