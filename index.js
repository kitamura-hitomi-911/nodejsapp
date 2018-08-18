var express = require('express');
var ejs = require('ejs');

var app = express();
app.engine('ejs',ejs.renderFile);

app.get('/', (req, res) => {
	res.render('index.ejs',
		{
			title:'トップ',
			lead:'リード文'
		});
});

var server = app.listen(3000, () => {
	console.log('サーバー起動')
});