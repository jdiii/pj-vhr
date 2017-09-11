var express = require('express');
var request = require('request');
var config = require('./config');
var bodyParser = require('body-parser');
var FTP = require('ftp');
var app = express();
app.use(bodyParser.json());

var form = {
	'SID': config.autocheckSid,
	'PWD': config.autocheckPwd,
	'CID': config.autocheckCid
};

app.get('/', function(req, res){
	res.send('There\'s nothing here!');
});


app.get('/vhr/:vin', function(req, res) {
	var vhrForm = JSON.parse(JSON.stringify(form));
	vhrForm['VIN'] = req.params.vin;
	request.post({url: config.autocheckHostname + config.autocheckApiPath, form: vhrForm}, function(err, response, body){
		res.send(response);
	});
});

app.post('/cudl-upload' function(req, res){
	let csv = req.body.inventory;
	let dealer = req.body.filename;
	let username = req.body.username;
	let password = req.body.password;
	let server = 'ftp.inventorycc.com';
	let csvBuffer = Buffer.from(csv);

 	let ftp = new FTP();
	ftp.on('ready', function(){
		ftp.put(csvBuffer, `${dealer}.csv`, function(err){
			console.log(err);
			if(err){
				res.status(500).send(err);
			} else {
				res.status(200).send('Uploaded \n' + csv);
			}
			ftp.end();
		});
	});

	ftp.connect({
		host: server,
		user: username,
		password: password,
	});

});


app.get('/badge/:vin', function(req, res) {

	var badgeForm = JSON.parse(JSON.stringify(form));
	badgeForm['VIN'] = req.params.vin;
	badgeForm['REPORT'] = 'R';
	badgeForm['TEMPLATE'] = '2'; //template 1 is 300x138 px, template 2 is 180x82 px
	request.post({url: config.autocheckHostname + config.autocheckApiPath, form: badgeForm}, function(err, response, body){
		res.send(response);
	});
});


app.listen(8080);
console.log('Listening on port 8080...');
