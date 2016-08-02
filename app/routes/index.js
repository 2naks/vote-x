'use strict';

var path = process.cwd();
var UserController =require('../controllers/userController.server.js');
var slugid = require('slugid');

module.exports = function (app, passport) {
	var userController = new UserController(passport);

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.render(path + '/views/index.ejs', {title:"Welcome", user:null});
		}
	}


	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/views/index.ejs', {title:"Welcome"});
		});

	app.route('/index')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/views/index.ejs', {title:"Welcome"});
		});

	app.route('/login')
		.get(function (req, res) {
			req.logout();
			res.render(path + '/views/login.ejs',{title:"Login"});
		})
		.post(function(req, res, next){
			console.log(req.body);
			next();
		},userController.postLogin);

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.render(path + '/views/login.ejs',{title:"Login",user: null });
		});

	app.route('/signup')
		.get(function (req, res) {
			req.logout();
			res.render(path + '/views/signup.ejs',{title:"Sign Up",user: null });
		})
		.post(userController.postSignUp);

	app.route('/settings')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/views/settings.ejs', {title:"Welcome"});
		})
		.post(isLoggedIn,userController.postChangePassword);


	app.route('/mypolls')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/views/mypolls.ejs', {title:"Welcome"});
		});

	app.route('/newpoll')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/views/index.ejs', {title:"Welcome"});
		})
		.post(isLoggedIn, userController.postNewPoll);

	app.route('/pollsuccess')
		.get(function (req, res) {
			res.render(path + '/views/pollsuccess.ejs', {title:"Welcome"});
		});

	/*app.route('/pollresult')
		.get(function (req, res) {
			res.render(path + '/views/pollresult.ejs', {title:"Welcome"});
		});*/


	app.route('/polls/:slug/vote')
		/*.get(function (req, res) {
			res.render(path + '/views/vote.ejs', {title:"Welcome"});
		})*/
		.post(userController.postVote);

	app.route('/pollsuccess')
		.get(isLoggedIn, function (req, res, next) {
			res.render(path + '/views/pollsuccess.ejs', {title:"Welcome"});
		});

	app.route('/polls/:slug')
		.get(function(req, res){
			res.render(path + '/views/pollresult.ejs', {title:"Welcome"});
		});

	app.route('/pollapi/mypolls')
		.get(isLoggedIn, userController.getMyPolls);	

	app.route('/pollapi/:slug')
		.get(userController.getPoll);	

	app.route('/delete/polls/:slug')
		.get(userController.getDeletePoll);
};
