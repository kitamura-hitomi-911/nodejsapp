var assignObj = require('./assignObj');
var knex = require('knex')({
	dialect:'sqlite3',
	connection:{
		filename:'./board_data.sqlite3'
	},
	useNullAsDefault:true
});
var Bookshelf = require('bookshelf')(knex);
var UsersData = Bookshelf.Model.extend({
	tableName:'users'
});

module.exports = function(req, res, next) {

	var rturl = req.query.rturl && req.query.rturl.match(/^\//) ? req.query.rturl : '/';

	// ログアウト
	if (req.url === '/logout') {
		delete req.session.user_id;
		next();
		return;
	}

	if(req.session.user_id){
		// セッションあり、ログイン済み
		// 有効なログインかチェック
		new UsersData().where('id','=',req.session.user_id).fetch().then((collection)=>{
			if(collection){
				assignObj.set('user.is_login',true);
				assignObj.set('user.id',collection.attributes.id);
				assignObj.set('user.name',collection.attributes.name);
				assignObj.set('user.comment',collection.attributes.comment);

				if(req.url.match(/^\/login/) || req.url.match(/^\/signup/)){
					// ログイン済みで ログイン画面 or 新規登録画面 ならリダイレクト
					res.redirect(rturl);
					return;
				}else{
					next();
				}
			}else{
				// 未ログイン
				if(!req.url.match(/^\/login/) && !req.url.match(/^\/logout/) && !req.url.match(/^\/signup/)){
					// ログアウト画面ではない  かつ 新規登録画面ではない かつ セッションが無ければ ログイン画面へ
					res.redirect('/login?rturl=' + encodeURIComponent(req.url));
					return;
				}
				next();
			}
		}).catch((err)=> {
			// 未ログイン
			if(!req.url.match(/^\/login/) && !req.url.match(/^\/logout/) && !req.url.match(/^\/signup/)){
				// ログアウト画面ではない  かつ 新規登録画面ではない かつ セッションが無ければ ログイン画面へ
				res.redirect('/login?rturl=' + encodeURIComponent(req.url));
				return;
			}
			next();
		});


	}else{
		// 未ログイン
		if(!req.url.match(/^\/login/) && !req.url.match(/^\/logout/) && !req.url.match(/^\/signup/)){
			// ログアウト画面ではない  かつ 新規登録画面ではない かつ セッションが無ければ ログイン画面へ
			res.redirect('/login?rturl=' + encodeURIComponent(req.url));
			return;
		}
		next();
	}

};