var User = require(process.cwd() + '/app/models/users.js');
var bcrypt = require('bcrypt-nodejs');




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

}
module.exports = UserController;