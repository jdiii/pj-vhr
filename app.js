var express = require('express');
var request = require('request');
var config = require('./config');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

var form = {
	'SID': config.autocheckSid,
	'PWD': config.autocheckPwd,
	'CID': config.authocheckCid,
	'VIN': req.params.vin
};

app.get('/', function(req, res){
	res.send('There\'s nothing here!');
});

app.get('vhr/:vin', function(req, res) {
	request.post({url: config.autocheckHostname + config.autocheckApiPath, form: form}, function(err, response, body){
		res.send(response);
	});
});

app.get('badge/:vin', function(req, res) {

	var badgeForm = form;
	badgeForm['REPORT'] = 'R';
	badgeForm['TEMPLATE'] = '2'; //template 1 is 300x138 px, template 2 is 180x82 px
	request.post({url: config.autocheckHostname + config.autocheckApiPath, form: badgeForm}, function(err, response, body){
		res.send(response);
	});
});


app.listen(3001);
console.log('Listening on port 3001...');
