'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');


module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// Sign in with Email and Password
	passport.use('local',new LocalStrategy({usernameField:'email',
	 passwordField: 'password',

	},
	  function(email, password, done) {
	  	console.log("Looking for email");
	    User.findOne({ email: email } , function(err, user) {
	     
	      if (err) { return done(err); }
	      if (!user) {
	      	
	        return done(null, false, { message: 'Email not found.' });
	      }
	      user.comparePassword(password, function(err,isMatch){
	      	if(isMatch){
	      		return done(null, user);
	      	} else {
	      		return done(null, false, { msg: 'Invalid email or password.' });
	      	}
	      });
	    });
	  }
	));


	
	
};
