var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('board_data.sqlite3');


/* GET home page. */
router.get('/', function(req, res, next){
	db.serialize(() => {
		db.all("select * from users", (err, rows) => {
			if(!err){
				// console.log(rows);
				res.render('index', {title: 'Express'});
			}
		})
	});
});
module.exports = router;
