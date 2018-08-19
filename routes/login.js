var express = require('express');
var router = express.Router();
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

var assignObj = require('../assignObj');

/* GET login page. */
router.get('/', function(req, res, next){
	console.log('login get');
	var rturl = req.query.rturl || '';
	assignObj.set('form',{
		rturl:rturl,
		err: '',
		mail: ''
	});
	var rturl = req.query.rturl || '';
	res.render('login', assignObj.get());
});
router.post('/',function(req, res, next){
	console.log('login post');
	var rturl = req.body.rturl && req.body.rturl.match(/^\//) ? req.body.rturl : '/';
	assignObj.set('form',{
		rturl:rturl,
		err: '',
		mail:req.body.mail || ''
	});
	if(!req.body.mail || !req.body.password){
		assignObj.set('form.err','メールアドレス・パスワードを入力してください。');
		res.render('login', assignObj.get());
		return;
	}
	new UsersData().where('mail','=',req.body.mail).fetch().then((collection)=>{
		if(collection){
			if(collection.attributes.password === req.body.password){
				console.log('アカウントあり');
				req.session.user_id = collection.attributes.id;
				res.redirect(decodeURIComponent(rturl));
			}else{
				assignObj.set('form.err','メールアドレスもしくはパスワードが違います');
				res.render('login', assignObj.get());
			}
		}else{
			assignObj.set('form.err','メールアドレスもしくはパスワードが違います');
			res.render('login', assignObj.get());
		}

	}).catch((err)=>{
		console.log('then error',err);
		res.status(500).json({error:true,data:{massage:err.message}});
	});


});

module.exports = router;