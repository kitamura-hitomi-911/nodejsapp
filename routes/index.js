var express = require('express');
var router = express.Router();

var assignObj = require('../assignObj');

/* GET home page. */
router.get('/', function(req, res, next){
	console.log(assignObj.get());
	res.render('index', assignObj.get());
});
module.exports = router;
