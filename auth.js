var assignObj = require('./assignObj');

module.exports = function(req, res, next) {

	var rturl = req.query.rturl && req.query.rturl.match(/^\//) ? req.query.rturl : '/';

	// ログアウト
	if (req.url === '/logout') {
		delete req.session.user_id;
	}

	// ログイン済みなら情報をアサイン
	if(req.session.user_id){
		assignObj.set('user.is_login',true);
	}

	if(!req.session.user_id && !req.url.match(/^\/login/) && !req.url.match(/^\/logout/) && !req.url.match(/^\/signup/)){
		// ログイン画面ではない かつ ログアウト画面ではない  かつ 新規登録画面ではない かつ セッションが無ければ ログイン画面へ
		res.redirect('/login?rturl=' + encodeURIComponent(req.url));
	}else if(req.session.user_id && (req.url.match(/^\/login/) || req.url.match(/^\/signup/))){
		// (ログイン画面 or 新規登録画面) かつ セッションありの場合リダイレクト
		res.redirect(rturl);
	}else{
		next();
	}
};