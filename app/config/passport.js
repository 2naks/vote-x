'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');


module.exports = function (passport,app) {
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


	// Sign in with Facebook
	passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: '/auth/facebook/callback',
		profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
		enableProof: true,
		passReqToCallback: true
	},
	function(req,accessToken, refreshToken, profile, done){
		console.log(profile);
		if(req.user){
			User.findOne({facebookID: profile.id}, function(err, user){
				if(err){
					throw err;
				}
				if(user){
					console.log("There is user")
						//user.facebookID = "";
						console.log(user);
						req.flash('error',"This facebook account has already been used.");
						done(err);				
				}else{
					User.findOne({email: req.user.email}, function(err, user){
					if(err){
						throw err;
					}

					user.facebookID = profile.id;
					user.save(function(err) {
						console.log("saved");
						console.log(app.locals.fbCallbackUrl)
						req.flash('success', "Your account has been linked to your facebook acount");
						done(null, user)
					});
					console.log(profile);
				});
				}

				
			})
		} else {
			User.findOne({facebookID: profile.id}, function(err, user){
				if(err){
					throw err;
				}
				if(user){
					return done(null, user);
				}
				User.findOne({email:profile._json.email}, function(err, user){
					if(user){
						req.flash('errors','There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.');
          				done(err);
					} else {
						var user = new User;
						user.email = profile._json.email || profile.id;
						user.name = profile._json.first_name;
						user.facebookID = profile.id;
						user.save(function(err){
							done(err, user);
						});
					}
					
				});
			});
		}
		
	}
	));


	
	
};
