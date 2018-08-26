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
Bookshelf.plugin('pagination');

var UsersData = Bookshelf.Model.extend({
	tableName:'users'
});
var MessagesData = Bookshelf.Model.extend({
	tableName:'messages',
	hasTimestamps:true,
	user:function(){
		return this.belongsTo(UsersData);
	}
});

var assignObj = require('../assignObj');

/* GET home page. */
router.get('/', function(req, res, next){
	console.log(assignObj.get());
	new MessagesData().orderBy('created_at','DESC')
		.fetchPage({page:1,pageSize:10,withRelated:['user']})
		.then((collection) => {
		console.log(collection);
		assignObj.set('messages',collection.toArray());
		res.render('index', assignObj.get());
	}).catch((err) => {
		res.render('index', assignObj.get());
	});

});
module.exports = router;
