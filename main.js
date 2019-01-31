const express = require('express');
let port = process.env.PORT || 8080;

const app = express();


app.listen(port, function () {
	console.log('server up on port: ' + port);
});

app.get('/', function (req, res) {
	res.sendFile('site/index.html');
});