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
var MessagesData = Bookshelf.Model.extend({
	tableName:'messages'
});

var assignObj = require('../assignObj');


/* POST addMessage. */
router.post('/add', function(req, res, next){
	console.log(req.body);
	if(!req.body.message || !req.body.user_id){
		console.log('パラメータ不足');
		res.redirect('/');
		return;
	}else{
		new MessagesData(req.body).save().then(model => {
			console.log(model);
			res.redirect('/');
			return;
		}).catch((err)=>{
			console.log('then error',err.message);
			res.redirect('/');
			return;
		});
	}

});

module.exports = router;