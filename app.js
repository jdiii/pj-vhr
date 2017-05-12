var express = require('express');
var request = require('request');
var config = require('./config');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('There\'s nothing here!');
});

app.get('/vhr/:vin', function(req, res) {
	var form = {
		'SID': config.autocheckSid,
		'PWD': config.autocheckPwd,
		'CID': config.authocheckCid,
		'VIN': req.params.vin
	};
	request.post({url: config.autocheckHostname + config.autocheckApiPath, form: form}, function(err, response, body){
		res.send(response);
	});

});


app.listen(3001);
console.log('Listening on port 3001...');
