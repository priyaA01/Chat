// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
//var passport = require("./config/passport");
var db = require("./models");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: true
}));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static(__dirname + '/public'));

// Routes
// =============================================================
require("./routes/chat-api-routes.js")(app);
require("./routes/login-api-routes.js")(app);
require("./routes/html-routes.js")(app);

// Starts the server to begin listening
// =============================================================

db.sequelize.sync({
	// force: true
}).then(function () {
	server.listen(PORT, function () {
		console.log("App listening on PORT " + PORT);

	});
});

// socket connection and disconnect 
// =============================================================

io.on('connection', function (socket) {
	console.log('user connected ' + socket.id);

	socket.on('chat message', function (msg) {
		io.emit('chat message', msg);
	});

	socket.on('disconnect', function () {
		console.log('user disconnected   ' + socket.id);
	});

});