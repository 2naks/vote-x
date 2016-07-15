var mongose = require("mongoose");
var Schema = mongoose.Schema;

var Poll = new Schema({
	name:String,
	options:{},
	createdBy: String
});