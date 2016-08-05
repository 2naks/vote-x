'use strict';

var express = require('express');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo')(session);
var logger = require('morgan');

var app = express();


app.set('view engine', 'ejs');

require('dotenv').load();
require('./app/config/passport.js')(passport,app);

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret: 'secretClement',
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({url:process.env.MONGODB_URI})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user; // req.user is populated by passportjs
	next();
});


app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));


mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(){
	console.log("Connected to database");

	
});

routes(app, passport);
	


	var port = process.env.PORT || 3000;
	app.listen(port,  function () {
		console.log('Node.js listening on port ' + port + '...');
	});






