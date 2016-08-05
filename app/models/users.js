'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var PollOptionsSchema = new Schema({
	label:String,
	value: Number
});

var VotersSchema = new Schema({
	name: String
});

var PollSchema = new Schema({
	name:String,
	options:[PollOptionsSchema],
	createdBy: String,
	slug: String,
	voters:[VotersSchema]
});

var UserSchema = new Schema({
	name: {type: String},
	email: {type: String, required: true, lowercase: true, unique: true},
	password: String,
	polls:[PollSchema],

	facebookID: String

});



UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')){
		return next();
	}

	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		next();

	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);