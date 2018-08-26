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

/* GET signup page. */
router.get('/', function(req, res, next){
	console.log('signup get');
	var rturl = req.query.rturl || '';
	assignObj.set('form',{
		rturl:rturl,
		err: '',
		name: '',
		mail: '',
		password: '',
		comment:''
	});
	var rturl = req.query.rturl || '';
	res.render('signup', assignObj.get());
});
router.post('/',function(req, res, next){
	console.log('signup post');
	var rturl = req.body.rturl && req.body.rturl.match(/^\//) ? req.body.rturl : '/';
	assignObj.set('form',{
		rturl:rturl,
		err: {},
		name: req.body.name || '',
		mail:req.body.mail || '',
		password: req.body.password || '',
		comment: req.body.comment || ''
	});
	if(!req.body.mail || !req.body.password || !req.body.name || !req.body.comment){
		assignObj.set('form.err.lead','すべて入力必須です');
		res.render('signup', assignObj.get());
		return;
	}
	// 登録済みのメールアドレスかどうか確認

	new UsersData().where('mail','=',req.body.mail).fetch().then((collection)=>{
		var is_already_registed = false;
		if(collection){
			if(collection.attributes.mail === req.body.mail){
				is_already_registed = true;
			}
		}
		if(is_already_registed){
			console.log('すでに登録済みのメールアドレス');
			assignObj.set('form.err.mail','すでに登録済みのメールアドレスです');
			res.render('signup', assignObj.get());
		}else{
			// 登録処理
			var save_data = {
				name: req.body.name,
				mail:req.body.mail,
				password: req.body.password,
				comment: req.body.comment
			};
			var rturl = req.body.rturl && req.body.rturl.match(/^\//) ? req.body.rturl : '/';
			new UsersData(save_data).save().then(model => {
				console.log(model);
				req.session.user_id = model.attributes.id;
				res.redirect(decodeURIComponent(rturl));

			}).catch((err)=>{
				console.log('then error',err.message);
				assignObj.set('form.err.lead',err.message);
				res.render('signup', assignObj.get());
			});
		}
	}).catch((err)=>{
		console.log('then error',err);
		res.status(500).json({error:true,data:{massage:err.message}});
	});





});

module.exports = router;