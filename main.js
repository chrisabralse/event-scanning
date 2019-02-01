const express = require('express');
const path = require('path');
const Datastore = require('nedb')
let pairedDevices = new Datastore();
let port = process.env.PORT || 8080;

const app = express();

function assignToken() {
	return getRandomString();
}

function getRandomString() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


app.listen(port, function () {
	console.log('server up on port: ' + port);
});

app.use(express.static('statics'))

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/sites/pair.html'));

});

app.get('/pair', function (req, res) {
	console.log(req.query);
	let token = assignToken();
	res.redirect('/paired?' + token);

});
app.get('/paired', function (req, res) {
	res.sendFile(path.join(__dirname + '/sites/scanner.html'));

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