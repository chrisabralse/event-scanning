const express = require('express');
const path = require('path');
const Datastore = require('nedb')
const util = require('util');
let pairedDevices = new Datastore();
let registrationData = new Datastore();
let eventData = {};
let port = process.env.PORT || 8080;

const app = express();


const eventInsertAsync = util.promisify(registrationData.insert);
const pairInsertAsync = util.promisify(pairedDevices.insert);
const eventFindAsync = util.promisify(registrationData.find);
const pairFindAsync = util.promisify(pairedDevices.find);




app.listen(port, function () {
	console.log('server up on port: ' + port);
});

app.use(express.static('statics'));
app.use(express.json());

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/sites/pair.html'));

});

app.get('/pair', function (req, res) {
	let pairedDevice = {
		eventId: req.query.eId
	}

	/*test record */
	registrationData.insert({
		regId: req.query.eId,
		eventId: req.query.eId,
		confirmed: true,
		checkedIn: false,
		name: 'Chris Abraham',
		guests: 0
	});

	pairedDevices.insert(pairedDevice, function (err, result) {
		res.redirect('/paired?token=' + result._id);
	});
});
app.get('/paired', function (req, res) {
	res.sendFile(path.join(__dirname + '/sites/scanner.html'));

});


app.post('/scan', function (req, res) {
	let token = req.body.token;
	let scanData = req.body.scanData;


	pairedDevices.find({
		_id: token
	}, function (err, result) {
		if (result.length == 1) {
			let eventId = result[0].eventId;

			registrationData.find({
				regId: scanData,
				eventId: eventId
			}, function (err, result) {
				return checkRegistration(res, result);
			});
		}
	})
});

function checkRegistration(res, result) {
	if (result.length == 0) {
		// no record found
		res.send({
			status: 'not found'
		});
	}
	if (result.length == 1) {
		result = result[0];
		if (result.confirmed && !result.checkedIn) {
			// check in
			result.checkedIn = true;
			registrationData.update({
				_id: result._id
			}, result, function (err, numReplaced) {
				console.log(numReplaced);
			})
			res.send({
				status: 'success',
				result: result
			});
		}
	}
}


app.post('/getEventData', function (req, res) {
	let token = req.body.token;

	pairedDevices.find({
		token: token
	}, function (err, result) {

		let eventId = result.eventId;

		registrationData.find({
			eventId: eventId
		}, function (err, result) {
			console.log(result);
			return result;
		});
	})
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