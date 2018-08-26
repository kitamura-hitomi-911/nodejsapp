var express = require('express');
var router = express.Router();

var assignObj = require('../assignObj');

/* GET logout page. */
router.get('/', function(req, res, next){
	res.render('logout', {
	});
});

module.exports = router;