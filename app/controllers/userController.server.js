var User = require(process.cwd() + '/app/models/users.js');
var bcrypt = require('bcrypt-nodejs');
var slug = require('slugid');




function UserController(passport){

	// POST /signup
	this.postSignUp = function(req, res, next){
		var user = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
			//polls: []
		});

		User.findOne({email: req.body.email}, function(err, existingUser){
			if (existingUser){
				req.flash('error', 'Email already exists.Try Again')
				res.redirect('/signup');
			}
			user.save(function(err){
				if(err){
					return err;
				}
				req.logIn(user, function(err){
					if (err){
						return next(err);
					}
					res.redirect('/');
				});
			});
		});
	}


	//POST /login
	this.postLogin = function(req, res,next){
		console.log("postLogin");
		console.log(req.body);
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				console.log("err");
				return next(err);
			}
			if (!user) {
				console.log("no user");
				req.flash('errors', info);
				return res.redirect('/login');
			}
			req.logIn(user, function(err) {
				console.log("logged in")
				if (err) {
					return next(err);
				}
				req.flash('success', {
					msg: 'Success! You are logged in.'
				});
				res.redirect(req.session.returnTo || '/');
			});
		})(req, res, next);
	}


	//POST /settings
	this.postChangePassword = function(req, res, next){
		console.log(req.body)
		console.log(req.user);
		var currentPassword = bcrypt.compareSync(req.body.current_password, req.user.password);

		if(!currentPassword){
			req.flash('error', 'Current password is  incorrect.')
			res.redirect('/settings')
		}
		if(!req.body.new_password){
			req.flash('error', 'New password field is empty.');
			res.redirect('/settings');
		}
		if(req.body.new_password){
			User.findOne({email: req.user.email}, function(err, user){
				if(err){
					throw err;
				}
				console.log(user);
				user.password = req.body.new_password;
				user.save(function(err){
					if(err){
						throw err;
					}
				});

			});
		}

		req.flash('success', 'Your password has been changed');
		res.redirect('/settings');
	}

	this.postNewPoll = function(req, res, next){
		
		User.findOne({email: req.user.email}, function(err, user){
				if(err){
					throw err;
				}
				console.log(req.body)
				var pollOptions = [];
				req.body.options.forEach(function(option){
					pollOptions.push({label: option, value: 1});
				});
				console.log(pollOptions);
				var slugID = slug.nice();
				user.polls.push({name: req.body.name, options: pollOptions, createdBy: req.user.name, slug: slugID});
				//user.polls = []; // To wipe polls
				user.save(function(err){
					if(err){
						throw err;
					}
					console.log(slugID);
					req.flash('slug','/polls/' + slugID);
					res.redirect('/pollsuccess');
			}); 		
		});	
	}

	this.getPoll = function(req, res,next){

		User.findOne({'polls.slug': req.params.slug}, function(err, user){
			if(err){
				throw err;
			}
			

			user.polls.forEach(function(poll){
				if(poll.slug == req.params.slug ){
						//console.log(poll);
						//console.log(poll.options);
						//res.locals.user.password = "";
						console.log(poll.slug)
						return res.json(poll);
				}
			});


		});
		
	}

	this.getMyPolls = function(req, res, next){
		if(req.user.polls == []){
			res.json({'info': 'No polls found'});
		}

		res.json(req.user.polls);
	}

	this.getDeletePoll = function(req, res, next){
		if(req.user.polls == []){
			res.json({'info': 'No polls found'});
		}

		User.findOneAndUpdate({'polls.slug': req.params.slug},
		 {$pull: { polls: {slug: req.params.slug}}},
		 function(err, user){
			if(err){
				throw err;
			}

			req.flash('delete', 'Poll has been deleted');
			res.redirect('/mypolls');
		});
	}
}

module.exports = UserController;