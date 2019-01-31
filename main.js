const express = require('express');
const path = require('path');
var Datastore = require('nedb'),
	devices = new Datastore({
		filename: path.join(__dirname + '/databases/devices'),
		autoload: true
	});
let port = process.env.PORT || 8080;

const app = express();


app.listen(port, function () {
	console.log('server up on port: ' + port);
});

app.use(express.static('statics'))

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/sites/index.html'));
	console.log(devices);
});


app.get('*', function (req, res) {
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname + '/sites/404.html'));
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({
			error: 'Not found'
		});
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
});